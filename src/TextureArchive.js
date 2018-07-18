import DocumentArchiveReadWrite from './dar/DocumentArchiveReadWrite'
import StorageClientTypes from "./dar/StorageClientTypes"
import vfsSaveHook from "./shared/vfsSaveHook"

export default class TextureArchive extends DocumentArchiveReadWrite {

  constructor(documentArchiveConfig) {
    super(documentArchiveConfig)
    this._checkStorage(documentArchiveConfig)
  }

  load(archiveId) {
    let readWriteArchiveLoad = super.load(archiveId)

    return new Promise(function (resolve, reject) {
      readWriteArchiveLoad
        .then(function(archive) {
          resolve(archive)
        })
        .catch(function(errors) {
          reject(errors)
        })
    })
  }

  _checkStorage(documentArchiveConfig) {
    if (this._storageConfig && this._storageConfig.getId() === StorageClientTypes.VFS ) {
      vfsSaveHook(this._storage, TextureArchive, documentArchiveConfig)
    }
  }
}