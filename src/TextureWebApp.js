import { parseKeyEvent } from 'substance'
import TextureAppMixin from './TextureAppMixin'
import TextureWebAppChrome from './TextureWebAppChrome'

export default class TextureWebApp extends TextureAppMixin(TextureWebAppChrome) {
  _getDefaultDataFolder () {
    return './data/'
  }

  _handleKeyDown (event) {
    let key = parseKeyEvent(event)
    // CommandOrControl+S
    if (key === 'META+83' || key === 'CTRL+83') {
      event.preventDefault()
      this._save(err => {
        if (err) console.error(err)
      })
    }
  }
}
