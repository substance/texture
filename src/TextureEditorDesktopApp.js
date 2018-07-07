const {
  getQueryStringParam,
  substanceGlobals,
  platform
} = window.substance

const {
  TextureDesktopApp
} = window.texture

const ipc = require('electron').ipcRenderer
const darServer = require('dar-server')
const { FSStorageClient } = darServer
const url = require('url')
const path = require('path')
const remote = require('electron').remote
const { shell } = remote

import DesktopAppChrome from './DesktopAppChrome'
import EditorPackage from './editor/EditorPackage'
import InMemoryDarBuffer from './dar/InMemoryDarBuffer'
import TextureAppMixin from './TextureAppMixin'
import TextureArchiveConfig from './TextureArchiveConfig'

export default class TextureEditorDesktopApp extends TextureAppMixin(DesktopAppChrome) {
  
  static start(customMountConfig, customMountPoint) {
    substanceGlobals.DEBUG_RENDERING = platform.devtools
      
    // HACK: we should find a better solution to intercept window.open calls
    // (e.g. as done by LinkComponent)
    window.open = function(url /*, frameName, features*/) {
      shell.openExternal(url)
    }

    let finalMountConfig = TextureEditorDesktopApp._getFinalMountConfig(customMountConfig)
    let finalMountPoint = TextureEditorDesktopApp._getFinalMountPoint(customMountPoint)
        
    console.group("TexturEditorDesktopApp.mount()")
        console.group("mount config")
            console.log(finalMountConfig)
        console.groupEnd()
    console.groupEnd()

    return TextureEditorDesktopApp.mount(finalMountConfig, finalMountPoint)
  }

  static _getFinalMountConfig(customMountConfig) {
    let defaultMountConfig = TextureEditorDesktopApp._getDefaultMountConfig(),
        archiveIdQueryParam = getQueryStringParam('archive')

    if (archiveIdQueryParam) {
      customMountConfig.archiveId = archiveIdQueryParam
    }

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
      archiveId: getQueryStringParam('archive') || 'kitchen-sink',
      documentArchiveConfig: documentArchiveConfig,
      ipc,
      url,
      path,
      remote,
      __dirname
    }
  }
}