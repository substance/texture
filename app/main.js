const electron = require('electron')
const fs = require('fs')
const path = require('path')
const url = require('url')
const fsExtra = require('fs-extra')
const { DarFileStorage } = require('./lib/texture')
const debug = require('debug')('main')

const {
  app, dialog, shell, protocol, session,
  BrowserWindow, Menu, ipcMain
} = electron
const DEBUG = process.env.DEBUG

const BLANK_DOCUMENT = path.join(__dirname, 'templates', 'blank.dar')
const BLANK_FIGURE_PACKAGE = path.join(__dirname, 'templates', 'blank-figure-package.dar')
const templates = {
  'article': BLANK_DOCUMENT,
  'figure-package': BLANK_FIGURE_PACKAGE
}

let argv = process.argv

// initialize a shared storage where DAR files are extracted to
const tmpDir = app.getPath('temp')
const darStorageFolder = path.join(tmpDir, app.getName(), 'dar-storage')
fsExtra.ensureDirSync(darStorageFolder)
const sharedStorage = new DarFileStorage(darStorageFolder, 'dar://')
// keeping a handle to every opened window
const windowStates = new Map()
const _pendingOpenFileRequests = []

app.on('ready', () => {
  protocol.registerFileProtocol('dar', (request, handler) => {
    debug('handling "dar://" request: ' + request.url)
    // stripping away the protocol prefix 'dar://' and normalizing the requested path
    const resourcePath = path.normalize(request.url.substr(6))
    // console.log('dar-protocol: resourcePath', resourcePath)
    if (/\.\./.exec(resourcePath)) {
      handler({ error: 500 })
    } else {
      let absPath = path.join(darStorageFolder, resourcePath)
      debug('.. resolved to ' + absPath)
      handler({ path: absPath })
    }
  }, (error) => {
    if (error) console.error('Failed to register protocol')
  })

  // register a hook for downloads, i.e. when the user clicks on an `<a>` element
  // with attribute `download` set
  session.defaultSession.on('will-download', (event, item) => {
    let location = dialog.showSaveDialog({ defaultPath: item.getFilename() })
    // If there is no location coming from dialog the user has cancelled and
    // we have to prevent the default action to close dialog without error
    if (location) {
      item.setSavePath(location)
    } else {
      event.preventDefault()
    }
  })

  _createMenu()

  // FIXME: this is only run once, but not when the app is already running
  // in the background. We should do this at a different place
  let dars = []
  argv.forEach(arg => {
    debug('analyzing CLI argument: ' + arg)
    let dar = _detectDar(arg)
    if (dar) {
      dars.push(dar)
    }
  })
  // ATTENTION: on MacOS it happens that when run from command line
  // open-file requests are triggered before the app is ready
  // and on the other hand process.argv is empty
  dars = dars.concat(_pendingOpenFileRequests)
  if (dars.length > 0) {
    debug(`opening ${dars.length} dars`)
    for (let dar of dars) {
      _openDar(dar)
    }
  } else {
    _openNew()
  }
})

// Open file in MAC OS
app.on('open-file', (event, path) => {
  debug('open-file requested for ' + path)
  // TODO: what would be the default behavior here and why are we preventing it?
  event.preventDefault()

  // FIXME: when installed as MacOS app this gets called
  // before app was ready. And strangely, the process.argv seems to be empty.
  // One 'hack' to get this working is, to store open-file requests, and
  // do them when the app is ready
  let dar = _detectDar(path)
  if (dar) {
    if (app.isReady()) {
      _openDar(dar)
    } else {
      _pendingOpenFileRequests.push(dar)
    }
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // console.log('### window-all-closed')
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  let windows = BrowserWindow.getAllWindows()
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (windows.length === 0) {
    _promptOpen()
  }
})

function _openDar (dar) {
  let opts = {}
  switch (dar.type) {
    case 'packed': {
      debug('opening DAR from file')
      break
    }
    case 'unpacked': {
      debug('opening DAR from folder')
      opts.folder = true
      break
    }
    default:
      console.error('FIXME: invalid DAR record')
      return
  }
  _createEditorWindow(dar.file, opts)
}

// TODO: Make sure the same dar folder can't be opened multiple times
function _createEditorWindow (darPath, options = {}) {
  // Create the browser window.
  let editorWindow = new BrowserWindow({ width: 1024, height: 768 })
  let editorConfig = {
    darStorageFolder,
    darPath,
    readOnly: Boolean(options.isNew)
  }
  if (options.folder) {
    Object.assign(editorConfig, {
      unpacked: true
    })
  }
  editorWindow.editorConfig = editorConfig
  editorWindow.sharedStorage = sharedStorage

  let windowId = editorWindow.id
  windowStates.set(windowId, {
    dirty: false
  })
  // and load the index.html of the app.
  let mainUrl = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  })
  editorWindow.loadURL(mainUrl)

  // Open the DevTools.
  if (DEBUG) {
    editorWindow.webContents.openDevTools()
  }

  editorWindow.on('close', e => {
    let state = windowStates.get(windowId)
    if (state.dirty) {
      _promptUnsavedChanges(e, editorWindow)
    }
  })

  editorWindow.on('closed', e => {
    windowStates.delete(windowId)
  })
}

ipcMain.on('updateState', (event, windowId, update) => {
  let state = windowStates.get(windowId)
  if (state) {
    Object.assign(state, update)
  }
})

function _promptUnsavedChanges (event, editorWindow) {
  let choice = dialog.showMessageBox(
    editorWindow,
    {
      type: 'question',
      title: 'Unsaved changes',
      message: 'Document has changes, do you want to save them?',
      buttons: ["Don't save", 'Cancel', 'Save'],
      defaultId: 2,
      cancelId: 1
    }
  )
  if (choice === 1) {
    // stop quitting
    event.preventDefault()
    event.returnValue = false
  } else if (choice === 2) {
    // TODO: saving the archive takes a but of time
    // thus we need to prevent closing here too
    // But we should try closing again after archive has been saved
    event.preventDefault()
    event.returnValue = false
    let windowId = editorWindow.id
    ipcMain.once(`save:finished:${windowId}`, () => {
      // console.log('closing window', windowId)
      editorWindow.close()
    })
    editorWindow.webContents.send('save')
  }
}

function _promptOpen () {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Dar Files', extensions: ['dar'] }
    ]
  }, (fileNames) => {
    if (fileNames && fileNames.length > 0) {
      // not possible to select multiple DARs at once
      let darPath = fileNames[0]
      console.info('opening Dar: ', darPath)
      _createEditorWindow(darPath)
    }
  })
}

function _openNew (templateId) {
  templateId = templateId || 'article'
  const template = templates[templateId]
  _createEditorWindow(template, { isNew: true })
}

// used to dispatch save requests from the menu to the window
function _save () {
  let focusedWindow = BrowserWindow.getFocusedWindow()
  if (focusedWindow) {
    focusedWindow.webContents.send('save')
  }
}

// used to dispatch save requests from the menu to the window
function _saveAs () {
  let focusedWindow = BrowserWindow.getFocusedWindow()
  if (focusedWindow) {
    focusedWindow.webContents.send('saveAs')
  }
}

// TODO: extract this into something more reusable/configurable
function _createMenu () {
  // Set up the application menu1
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          submenu: [
            {
              label: 'Article',
              accelerator: 'CommandOrControl+N',
              click () {
                _openNew('article')
              }
            },
            {
              label: 'Figure Pacakge',
              click () {
                _openNew('figure-package')
              }
            }
          ]
        },
        {
          label: 'Open',
          accelerator: 'CommandOrControl+O',
          click () {
            _promptOpen()
          }
        },
        {
          label: 'Save',
          accelerator: 'CommandOrControl+S',
          click () {
            _save()
          }
        },
        {
          label: 'Save As...',
          accelerator: 'CommandOrControl+Shift+S',
          click () {
            _saveAs()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () {
            // TODO: why not use the globally required electron?
            shell.openExternal('http://substance.io/texture')
          }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function _isDAR (path) {
  return Boolean(/.dar$/i.exec(path))
}

function _detectDar (f) {
  if (!fs.existsSync(f)) return
  if (!path.isAbsolute(f)) {
    f = path.join(process.cwd(), f)
  }
  let stat = fs.statSync(f)
  if (stat) {
    if (stat.isFile() && _isDAR(f)) {
      return {
        type: 'packed',
        file: f
      }
    } else if (stat.isDirectory()) {
      // poor-man's check if the directory is an unpacked DAR
      let manifest = path.join(f, 'manifest.xml')
      if (fs.existsSync(manifest)) {
        return {
          type: 'unpacked',
          file: f
        }
      }
    }
  }
}
