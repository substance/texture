import { parseKeyEvent } from 'substance'
import WebAppChrome from './WebAppChrome'
import TextureAppMixin from './TextureAppMixin'

export default class TextureWebApp extends TextureAppMixin(WebAppChrome) {
  _getDefaultDataFolder () {
    return './data/'
  }

  // TODO: document why we need a different keydown behavior here
  // otherwise, if it should be the same, move the common implementation
  // into TextureAppMixin
  _handleKeyDown (event) {
    // Handle custom keyboard shortcuts globally
    let archive = this.state.archive
    let handled = false
    if (archive) {
      let manuscriptSession = archive.getEditorSession('manuscript')
      handled = manuscriptSession.keyboardManager.onKeydown(event)
    }
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
