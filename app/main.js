const electron = require('electron')

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const { app, ipcMain, Menu } = electron // eslint-disable-line no-unused-vars
const { dialog } = require('electron')

const DAR_FOLDER = process.env.DAR_FOLDER
const DEBUG = process.env.DEBUG
const BLANK_DOCUMENT_FOLDER = path.join(__dirname, 'data/blank')


// Keep a global reference of all the open windows
let windows = []

// TODO: Make sure the same dar folder can't be opened multiple times
function createEditorWindow(darFolder, isNew) {

  // Create the browser window.
  let editorWindow = new BrowserWindow({ width: 1024, height: 768 })

  let query = {
    archiveDir: darFolder
  }

  editorWindow.isSaved = true
  if (isNew) {
    query.isNew = "true"
    // Remember on the window object, so on next save we can delegate
    // to saveAs workflow
    editorWindow.isNew = true
  }
  // and load the index.html of the app.
  let mainUrl = url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    query,
    slashes: true
  })
  editorWindow.loadURL(mainUrl)
  windows.push(editorWindow)

  // Open the DevTools.
  if (DEBUG) {
    editorWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  editorWindow.on('closed', function () {
    var index = windows.indexOf(editorWindow)
    if (index >= 0) {
      windows.splice(index, 1)
    }
  })

  editorWindow.on('close', function(e) {
    // const focusedWindow = BrowserWindow.getFocusedWindow()
    const isSaved = editorWindow.isSaved
    if(!isSaved) {

      dialog.showMessageBox({
        type: "question",
        title: "Unsaved changes",
        message: "Document has changes, do you want to save them?",
        buttons: ["Don't save", "Cancel", "Save"],
        defaultId: 2,
        cancelId: 1
      }, function(buttonId) {
        if (buttonId === 0) {
          // Just close, no saving
        } else if (buttonId === 1) {
          // Just stay
          e.preventDefault()
        } else if (buttonId === 2) {
          // HACK: we don't have control over the save workflow (which is
          // done in the window). So it could happen that the window closes
          // before all changes are saved.
          save()
        }
      })
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createMenu()
  if (DAR_FOLDER) {
    createEditorWindow(DAR_FOLDER)
  } else {
    openNew()
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (windows.length === 0) {
    promptOpen()
  }
})

function createMenu() {
  // Set up the application menu1
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CommandOrControl+N',
          click() {
            openNew()
          }
        },
        {
          label: 'Open',
          accelerator: 'CommandOrControl+O',
          click() {
            promptOpen()
          }
        },
        {
          label: 'Save',
          accelerator: 'CommandOrControl+S',
          click() {
            save()
          }
        },
        {
          label: 'Save As...',
          accelerator: 'CommandOrControl+Shift+S',
          click() {
            saveAs()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'}
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://electronjs.org') }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function promptOpen() {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, (dirPaths) => {
    if (dirPaths) {
      dirPaths.forEach(dirPath => {
        console.info('opening Dar: ', dirPath)
        createEditorWindow(dirPath)
      })
    }
  })
}

function openNew() {
  createEditorWindow(BLANK_DOCUMENT_FOLDER, true)
}

function save() {
  let focusedWindow = BrowserWindow.getFocusedWindow()
  if (focusedWindow.isNew) {
    saveAs()
  } else {
    focusedWindow.webContents.send('document:save')
  }
}

function saveAs() {
  let focusedWindow = BrowserWindow.getFocusedWindow()
  dialog.showOpenDialog({
    title: 'Save archive as...',
    buttonLabel: 'Save',
    properties: ['openDirectory', 'createDirectory']
  }, (dirPaths) => {
    if (dirPaths) {
      let newPath = dirPaths[0]
      focusedWindow.webContents.send('document:save-as', newPath)
    }
  })
}

ipcMain.on('document:save-as:successful', (/*event*/) => {
  console.info('Save As was successful.')
  let focusedWindow = BrowserWindow.getFocusedWindow()
  focusedWindow.isNew = false
  focusedWindow.isSaved = true
})

ipcMain.on('document:unsaved', () => {
  let focusedWindow = BrowserWindow.getFocusedWindow()
  if (focusedWindow) {
    focusedWindow.isSaved = false
  } else {
    console.error('ERROR: Could not get focused window while receiving document:unsaved.')
  }
})
