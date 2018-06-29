import {
  getQueryStringParam, substanceGlobals, platform
} from 'substance'
import { TextureWebApp, TextureArchive, vfsSaveHook, EditorPackage } from 'substance-texture'

window.addEventListener('load', () => {
  substanceGlobals.DEBUG_RENDERING = platform.devtools
  let app = DevWebApp.mount({
    archiveId: getQueryStringParam('archive') || 'kitchen-sink',
    storageType: getQueryStringParam('storage') || 'vfs',
    storageUrl: getQueryStringParam('storageUrl') || '/archives'
  }, window.document.body)

  // put the archive and some more things into global scope, for debugging
  setTimeout(() => {
    window.app = app
  }, 500)
})

// This uses a monkey-patched VfsStorageClient that checks immediately
// if the stored data could be loaded again, or if there is a bug in
// Textures exporter
class DevWebApp extends TextureWebApp {

  _getStorage(storageType) {
    let storage = super._getStorage(storageType)
    if (storageType === 'vfs') {
      vfsSaveHook(storage, TextureArchive)
    }
    return storage
  }

  _getArticleConfig() {
    return EditorPackage
  }
}
