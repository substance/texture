const electron = require('electron')
const fs = require('fs')
const path = require('path')
const url = require('url')
const fsExtra = require('fs-extra')

const {
  app, dialog, shell, protocol, session,
  BrowserWindow, Menu, ipcMain
} = electron
const DEBUG = process.env.DEBUG

const tmpDir = app.getPath('temp')
const darStorageFolder = path.join(tmpDir, app.getName(), 'dar-storage')
fsExtra.ensureDirSync(darStorageFolder)

const windowStates = new Map()
const isDAR = path => Boolean(/.dar$/i.exec(path))

const BLANK_DOCUMENT = path.join(__dirname, 'templates', 'blank.dar')
const BLANK_FIGURE_PACKAGE = path.join(__dirname, 'templates', 'blank-figure-package.dar')
const templates = {
  'article': BLANK_DOCUMENT,
  'figure-package': BLANK_FIGURE_PACKAGE
}

app.on('ready', () => {
  protocol.registerFileProtocol('dar', (request, handler) => {
    const resourcePath = path.normalize(request.url.substr(6))
    // console.log('dar-protocol: resourcePath', resourcePath)
    if (/\.\./.exec(resourcePath)) {
      handler({ error: 500 })
    } else {
      handler({ path: path.join(darStorageFolder, resourcePath) })
    }
  }, (error) => {
    if (error) console.error('Failed to register protocol')
  })

  // Download files
  session.defaultSession.on('will-download', (event, item) => {
    let location = dialog.showSaveDialog({ defaultPath: item.getFilename() })
    item.setSavePath(location)
  })

  createMenu()

  // look if there is a 'dar' file in the args that does exist
  let darFiles = process.argv.filter(arg => isDAR(arg))
  darFiles = darFiles.map(f => {
    if (!path.isAbsolute(f)) {
      f = path.join(process.cwd(), f)
    }
    return f
  })
  darFiles = darFiles.filter(f => {
    let stat = fs.statSync(f)
    return (stat && stat.isFile())
  })
  console.log('darFiles', darFiles)
  if (darFiles.length > 0) {
    for (let darPath of darFiles) {
      createEditorWindow(darPath)
    }
  } else {
    openNew()
  }
})

// Open file in MAC OS
app.on('open-file', (event, path) => {
  event.preventDefault()
  if (isDAR(path)) {
    // If app already initialized we need to open a new editor window
    // if it's not, then we need to add path to arguments
    if (app.isReady()) {
      createEditorWindow(path)
    } else {
      process.argv.push(path)
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
    promptOpen()
  }
})

// TODO: Make sure the same dar folder can't be opened multiple times
function createEditorWindow (darPath, isNew) {
  // Create the browser window.
  let editorWindow = new BrowserWindow({ width: 1024, height: 768 })
  let windowId = editorWindow.id
  windowStates.set(windowId, {
    dirty: false
  })
  let query = {
    darPath,
    readOnly: isNew ? 'true' : 'false'
  }
  // and load the index.html of the app.
  let mainUrl = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    query,
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
      promptUnsavedChanges(e, editorWindow)
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

function promptUnsavedChanges (event, editorWindow) {
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

function promptOpen () {
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
      createEditorWindow(darPath)
    }
  })
}

function openNew (templateId) {
  templateId = templateId || 'article'
  const template = templates[templateId]
  createEditorWindow(template, true)
}

// used to dispatch save requests from the menu to the window
function save () {
  let focusedWindow = BrowserWindow.getFocusedWindow()
  if (focusedWindow) {
    focusedWindow.webContents.send('save')
  }
}

// used to dispatch save requests from the menu to the window
function saveAs () {
  let focusedWindow = BrowserWindow.getFocusedWindow()
  if (focusedWindow) {
    focusedWindow.webContents.send('saveAs')
  }
}

// TODO: extract this into something more reusable/configurable
function createMenu () {
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
                openNew('article')
              }
            },
            {
              label: 'Figure Pacakge',
              click () {
                openNew('figure-package')
              }
            }
          ]
        },
        {
          label: 'Open',
          accelerator: 'CommandOrControl+O',
          click () {
            promptOpen()
          }
        },
        {
          label: 'Save',
          accelerator: 'CommandOrControl+S',
          click () {
            save()
          }
        },
        {
          label: 'Save As...',
          accelerator: 'CommandOrControl+Shift+S',
          click () {
            saveAs()
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
