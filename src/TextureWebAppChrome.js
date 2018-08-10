/* global vfs */
import { parseKeyEvent } from 'substance'
import TextureAppChrome from './TextureAppChrome'
import { VfsStorageClient, HttpStorageClient, InMemoryDarBuffer } from './dar'

export default class TextureWebAppChrome extends TextureAppChrome {
  _loadArchive (archiveId, context, cb) {
    let storage = this._getStorage(this.props.storageType)
    let buffer = new InMemoryDarBuffer()
    let ArchiveClass = this._getArchiveClass()
    let archive = new ArchiveClass(storage, buffer, context)
    archive.load(archiveId, cb)
  }

  _getStorage (storageType) {
    if (storageType === 'vfs') {
      return new VfsStorageClient(vfs, this._getDefaultDataFolder())
    } else {
      return new HttpStorageClient(this.props.storageUrl)
    }
  }

  _handleKeyDown (event) {
    let key = parseKeyEvent(event)
    // CommandOrControl+S
    if (key === 'META+83' || key === 'CTRL+83') {
      this._save()
      event.preventDefault()
    }
  }

  _getArchiveClass () { throw new Error('This method is abstract') }

  _getDefaultDataFolder () { throw new Error('This method  is abstract') }
}
