const path = require('path')
const url = require('url')
const { ipcRenderer: ipc, remote } = require('electron')
const { shell, dialog } = remote
const { substanceGlobals, platform } = window.substance
const { TextureDesktopApp, UnpackedDarFolderStorage } = window.texture

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
  _window = remote.getCurrentWindow()

  let editorConfig = _window.editorConfig

  substanceGlobals.DEBUG_RENDERING = platform.devtools
  const archiveId = editorConfig.darPath
  const isReadOnly = editorConfig.readOnly

  let storage
  if (editorConfig.unpacked) {
    storage = new UnpackedDarFolderStorage(editorConfig.darPath)
  } else {
    storage = _window.sharedStorage
  }

  _app = TextureDesktopApp.mount({
    archiveId,
    // ATTENTION: we use this flag to open a dar as readOnly
    // e.g., the blank.dar from the app folder is used as a template for new dars
    // but must not be saved back to that file.
    isReadOnly,
    storage
  }, window.document.body)

  _app.on('save', () => {
    _saveOrSaveAs(_handleSaveError)
  })

  _app.on('openExternal', url => {
    shell.openExternal(url)
  })

  // ATTENTION: unfortunately it is very difficult to achieve a correct app closing behavior
  // w.r.t. to unsaved changes. I have tried to solve this in this window scope
  // because there we have the archive instance to check for pending changes.
  // This however  was not successful because it is not possible (to the current date)
  // to cancel app quiting from the renderer side.
  // It seems that event.returnValue or event.preventDefault() called on this side
  // does not have the effect on the app quitting as it is document.
  // Another strange observation, browserWindow.on('close') does not work on this side.
  // Altogether, it seems technically impossible to solve this in the a clean way.
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
    }, (newDarPath) => {
      if (newDarPath) {
        _app._saveAs(newDarPath, err => {
          if (err) {
            cb(err)
          } else {
            _updateWindowUrl(newDarPath)
            cb()
          }
        })
      } else {
        cb()
      }
    })
}

function _updateWindowUrl (newDarPath) {
  // Update the browser url, so on reload, we get the contents from the
  // new location
  let newUrl = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    query: {
      darPath: newDarPath
    },
    slashes: true
  })
  window.history.replaceState({}, 'After Save As', newUrl)
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
