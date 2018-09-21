import FSStorage from '../src/dar/FSStorage'

const {
  getQueryStringParam,
  substanceGlobals,
  platform
} = window.substance

const {
  TextureDesktopApp
} = window.texture

const ipc = require('electron').ipcRenderer
const url = require('url')
const path = require('path')
const remote = require('electron').remote
const { shell } = remote

// HACK: we should find a better solution to intercept window.open calls
// (e.g. as done by LinkComponent)
window.open = function (url /*, frameName, features */) {
  shell.openExternal(url)
}

window.addEventListener('load', () => {
  substanceGlobals.DEBUG_RENDERING = platform.devtools
  TextureDesktopApp.mount({
    archiveId: getQueryStringParam('archiveDir'),
    ipc,
    url,
    path,
    shell,
    storage: new FSStorage(),
    __dirname
  }, window.document.body)
})
