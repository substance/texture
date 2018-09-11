import TextureAppMixin from './TextureAppMixin'
import TextureDesktopAppChrome from './TextureDesktopAppChrome'

export default class TextureDesktopApp extends TextureAppMixin(TextureDesktopAppChrome) {
  // TODO: document why we need a different handleKeydown than in WebApp
  _handleKeydown (event) {
    // Handle custom keyboard shortcuts globally
    let archive = this.state.archive
    if (archive) {
      let manuscriptSession = archive.getEditorSession('manuscript')
      return manuscriptSession.keyboardManager.onKeydown(event)
    }
  }
}
