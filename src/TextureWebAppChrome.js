import { parseKeyEvent } from 'substance'
import TextureAppChrome from './TextureAppChrome'

export default class TextureWebAppChrome extends TextureAppChrome {
  _handleKeyDown(event) {
    let key = parseKeyEvent(event)
    // CommandOrControl+S
    if (key === 'META+83' || key === 'CTRL+83') {
      this._save()
      event.preventDefault()
    }
  }
}