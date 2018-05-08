import { parseKeyEvent } from 'substance'
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

  _getArchiveClass() {
    return TextureArchive
  }

  _getDefaultDataFolder() {
    return './data/'
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
