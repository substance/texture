import DocumentArchiveReadWrite from './dar/DocumentArchiveReadWrite'
import StorageClientTypes from "./dar/StorageClientTypes"
import vfsSaveHook from "./util/vfsSaveHook"

export default class TextureArchive extends DocumentArchiveReadWrite {

  constructor(documentArchiveConfig) {
    super(documentArchiveConfig)
    this._checkStorage(documentArchiveConfig)
  }

  load(archiveId) {
    let self = this,
        readWriteArchiveLoad = super.load(archiveId)

    return new Promise(function (resolve, reject) {
      readWriteArchiveLoad
        .then(function(archive) {
          window.archive = archive
          resolve(self)
        })
    })
  }

  _checkStorage(documentArchiveConfig) {
    if (this._storageConfig.getId() === StorageClientTypes.VFS ) {
        vfsSaveHook(this._storage, TextureArchive, documentArchiveConfig)
    }
  }
}