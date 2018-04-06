import { HttpStorageClient, VfsStorageClient, InMemoryDarBuffer, parseKeyEvent } from 'substance'
import WebAppChrome from './WebAppChrome'
import TextureArchive from './TextureArchive'

import {
  _renderTextureApp,
  _handleKeyDown
} from './textureAppHelpers'

export default class TextureWebApp extends WebAppChrome {

  render($$) {
    return _renderTextureApp($$, this)
  }

  _loadArchive(archiveId, context) {
    let storage
    if (this.props.storageType==='vfs') {
      storage = new VfsStorageClient(window.vfs, './data/')
    } else {
      storage = new HttpStorageClient(this.props.storageUrl)
    }
    let buffer = new InMemoryDarBuffer()
    let archive = new TextureArchive(storage, buffer, context)
    return archive.load(archiveId)
  }

  _handleKeyDown(event) {
    let handled = _handleKeyDown(event, this)
    if (!handled) {
      let key = parseKeyEvent(event)
      // CommandOrControl+S
      if (key === 'META+83' || key === 'CTRL+83') {
        this._save()
        event.preventDefault()
      }
    }
  }
}
