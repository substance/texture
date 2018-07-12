/* global vfs */
import { parseKeyEvent, InMemoryDarBuffer } from 'substance'
import DocumentArchiveFactory from './dar/DocumentArchiveFactory'
import AppChrome from './AppChrome'
import TextureArchive from './TextureArchive'

export default class WebAppChrome extends AppChrome {

  async _loadArchive(archiveId, context) {
    let documentArchiveConfig = this.props.documentArchiveConfig
    documentArchiveConfig.setContext(context)
    
    let archive = DocumentArchiveFactory.getDocumentArchive(documentArchiveConfig)
    
    if (!archive)
    {
      archive = new TextureArchive(documentArchiveConfig)
    }

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