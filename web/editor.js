import {
  getQueryStringParam, substanceGlobals, platform, VfsStorageClient, HttpStorageClient, InMemoryDarBuffer
} from 'substance'
import { TextureWebApp, TextureArchive } from 'substance-texture'

window.addEventListener('load', () => {
  substanceGlobals.DEBUG_RENDERING = platform.devtools
  let app = DevTextureWebApp.mount({
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
class DevTextureWebApp extends TextureWebApp {
  _loadArchive(archiveId, context) {
    let storage
    if (this.props.storageType==='vfs') {
      storage = new VfsStorageClient(window.vfs, './data/')
      // monkey patch VfsStorageClient so that we can check if the stored data
      // can be loaded
      storage.write = (archiveId, rawArchive) => {
        console.log(rawArchive)
        return storage.read(archiveId)
        .then((originalRawArchive) => {
          Object.assign(rawArchive.resources, originalRawArchive.resources)
          let testArchive = new TextureArchive()
          try {
            debugger
            testArchive._ingest(rawArchive)
          } catch (error) {
            window.alert('Exported TextureArchive is corrupt') //eslint-disable-line no-alert
            console.error(error)
          }
        })
        .then(() => {
          return false
        })
      }
    } else {
      storage = new HttpStorageClient(this.props.storageUrl)
    }
    let buffer = new InMemoryDarBuffer()
    let archive = new TextureArchive(storage, buffer, context)
    return archive.load(archiveId)
  }
}