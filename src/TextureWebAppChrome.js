/* global vfs */
import { parseKeyEvent } from 'substance'
import TextureAppChrome from './TextureAppChrome'
import { VfsStorageClient, HttpStorageClient, InMemoryDarBuffer } from './dar'

export default class TextureWebAppChrome extends TextureAppChrome {
  _getBuffer () {
    return new InMemoryDarBuffer()
  }

  _getStorage () {
    let storageType = this.props.storageType
    if (storageType === 'vfs') {
      return new VfsStorageClient(vfs, this._getDefaultDataFolder())
    } else {
      return new HttpStorageClient(this.props.storageUrl)
    }
  }

  // TODO: try to share implementation with TextureDesktopAppChrome
  // move as much as possible into TextureAppChrome
  // and only add browser specific overrides here
  _handleKeydown (event) {
    let key = parseKeyEvent(event)
    // console.log('Texture received keydown for combo', key)
    let handled = false
    // CommandOrControl+S
    if (key === 'META+83' || key === 'CTRL+83') {
      this._save(err => {
        if (err) console.error(err)
      })
      handled = true
    }
    if (!handled) {
      handled = this.refs.texture._handleKeydown(event)
    }
    if (handled) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
