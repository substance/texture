const {
  getQueryStringParam,
  substanceGlobals,
  platform
} = window.substance

const ipc = require('electron').ipcRenderer
const darServer = require('dar-server')
const { FSStorageClient } = darServer
const url = require('url')
const path = require('path')
const remote = require('electron').remote
const { shell } = remote

import TextureDesktopAppChrome from './TextureDesktopAppChrome'
import EditorPackage from './article/editor/EditorPackage'
import InMemoryDarBuffer from './dar/InMemoryDarBuffer'
import Texture from './Texture'
import TextureAppMixin from './TextureAppMixin'
import TextureArchiveConfig from './TextureArchiveConfig'

export default class TextureEditorDesktopApp extends TextureAppMixin(TextureDesktopAppChrome) {

  static start(customMountConfig, customMountPoint) {
    substanceGlobals.DEBUG_RENDERING = platform.devtools

    // HACK: we should find a better solution to intercept window.open calls
    // (e.g. as done by LinkComponent)
    window.open = function(url /*, frameName, features*/) {
      shell.openExternal(url)
    }

    let finalMountConfig = TextureEditorDesktopApp._getFinalMountConfig(customMountConfig)
    let finalMountPoint = TextureEditorDesktopApp._getFinalMountPoint(customMountPoint)

    return TextureEditorDesktopApp.mount(finalMountConfig, finalMountPoint)
  }

  static _getFinalMountConfig(customMountConfig) {
    let defaultMountConfig = TextureEditorDesktopApp._getDefaultMountConfig()
    return Object.assign(defaultMountConfig, customMountConfig)
  }

  static _getFinalMountPoint(customMountPoint) {
    return customMountPoint || window.document.body
  }

  static _getDefaultMountConfig() {
    let documentArchiveConfig = new TextureArchiveConfig()
        documentArchiveConfig.setArticleConfig(EditorPackage)
        documentArchiveConfig.setBuffer( new InMemoryDarBuffer() )
        documentArchiveConfig.setStorageClient( new FSStorageClient() )

    return {
      appClass: Texture,
      archiveId: getQueryStringParam('archiveDir'),
      documentArchiveConfig: documentArchiveConfig,
      ipc,
      url,
      path,
      remote,
      __dirname
    }
  }
}