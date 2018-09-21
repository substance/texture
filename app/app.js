import DarFileStorage from '../src/dar/DarFileStorage'

const path = require('path')
const url = require('url')
const { ipcRenderer: ipc, remote } = require('electron')
const { shell, app, dialog } = remote
const {
  getQueryStringParam, substanceGlobals, platform
} = window.substance
const { TextureDesktopApp } = window.texture

// HACK: this is redundant with main.js
// TODO: is there a different way to retrieve this location?
const tmpDir = app.getPath('temp')
const darStorageFolder = path.join(tmpDir, app.getName(), 'dar-storage')

let _app, _window

// HACK: we should find a better solution to intercept window.open calls (e.g. as done by LinkComponent)
window.open = function (url /*, frameName, features */) {
  shell.openExternal(url)
}

ipc.on('save', () => {
  _saveOrSaveAs(_saveCallback)
})

ipc.on('saveAs', () => {
  _saveAs(_saveCallback)
})

window.addEventListener('load', () => {
  substanceGlobals.DEBUG_RENDERING = platform.devtools
  const archiveId = getQueryStringParam('darPath')
  const isReadOnly = getQueryStringParam('readOnly') === 'true'
  _app = TextureDesktopApp.mount({
    archiveId,
    isReadOnly,
    storage: new DarFileStorage(darStorageFolder, 'dar://'),
    // TODO: do we really need to pass these down
    // I'd prefer to solve everything related to IPC comm here in this file
    ipc,
    url,
    path,
    shell,
    // TODO: document why and where we need this
    __dirname
  }, window.document.body)

  _app.on('save', () => {
    _saveOrSaveAs(_handleSaveError)
  })

  // ATTENTION: unfortunately it is very difficult to achieve a correct app closing behavior
  // w.r.t. to unsaved changes. I have tried to solve this in this window scope
  // because there we have the archive instance to check for pending changes.
  // This however  was not successful because it is not possible (to the current date)
  // to cancel app quiting from the renderer side.
  // It seems that event.returnValue or event.preventDefault() called on this
  // does not have the effect on the app quitting as it is document.
  // Another strange observation, browserWindow.on('close') does not work on this side.
  // Alltogether it seems technically impossible to solve this in the a clean way.
  // For that reason we have to maintain a (redundant) flag in the main process
  // indicating if a window's content should be considered dirty or not.
  _app.on('archive:ready', () => {
    let archive = _app.state.archive
    archive.on('archive:changed', () => {
      ipc.send('updateState', _window.id, {
        dirty: true
      })
    })
    archive.on('archive:saved', () => {
      ipc.send('updateState', _window.id, {
        dirty: false
      })
    })
  })

  _window = remote.getCurrentWindow()

  // NOTE: _window.on('close') does not work remotely
})

function _saveOrSaveAs (cb) {
  let archive = _app.state.archive
  if (!archive) return
  if (archive.isReadOnly) {
    _saveAs(cb)
  } else {
    _app._save(cb)
  }
}

function _saveAs (cb) {
  let archive = _app.state.archive
  if (!archive) return
  dialog.showSaveDialog(
    _window,
    {
      title: 'Save archive as...',
      buttonLabel: 'Save',
      properties: ['openFile', 'createDirectory'],
      filters: [
        { name: 'Dar Files', extensions: ['dar'] }
      ]
    }, (darPath) => {
      if (darPath) {
        _app._saveAs(darPath, cb)
      } else {
        cb()
      }
    })
}

function _handleSaveError (err) {
  console.error(err)
}

function _saveCallback (err) {
  if (err) {
    _handleSaveError(err)
  } else {
    let msg = `save:finished:${_window.id}`
    // console.log(msg)
    ipc.send(msg)
  }
}
