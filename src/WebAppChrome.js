import { parseKeyEvent } from 'substance'
import AppChrome from './AppChrome'

export default class WebAppChrome extends AppChrome {
  _handleKeyDown(event) {
    let key = parseKeyEvent(event)
    // CommandOrControl+S
    if (key === 'META+83' || key === 'CTRL+83') {
      this._save()
      event.preventDefault()
    }
  }
}
