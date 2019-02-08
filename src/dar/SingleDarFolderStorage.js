import FSStorage from './FSStorage'

/**
 * A storage implementation that is bound to a single folder.
 */
export default class SingleDarFolderStorage extends FSStorage {
  constructor (darFolder) {
    super()

    this.darFolder = darFolder
  }

  _normalizeArchiveDir () {
    return this.darFolder
  }

  clone (archiveDir, newArchiveDir, cb) {
    cb(new Error('Cloning is not supported by this storage type.'))
  }
}
