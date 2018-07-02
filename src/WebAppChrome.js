/* global vfs */
import { parseKeyEvent, InMemoryDarBuffer } from 'substance'
import StorageClientFactory from './dar/StorageClientFactory'
import AppChrome from './AppChrome'

export default class WebAppChrome extends AppChrome {

  async _loadArchive(archiveId, context) {
    let buffer = new InMemoryDarBuffer()
    let storage = StorageClientFactory.getStorageClient(this.props.storageConfig)
    let ArchiveClass = this.props.archiveClass
    let archive = new ArchiveClass(storage, buffer, context, {
      ArticleConfig: this.props.articleConfig
    })
    return archive.load(archiveId)
  }

  _handleKeyDown(event) {
    let key = parseKeyEvent(event)
    // CommandOrControl+S
    if (key === 'META+83' || key === 'CTRL+83') {
      console.log("Handling keydown event")
      this._save()
      event.preventDefault()
    }
  }
}
