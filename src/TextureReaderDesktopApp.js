import DesktopAppChrome from './DesktopAppChrome'
import TextureAppMixin from './TextureAppMixin'

export default class TextureReaderDesktopApp extends TextureAppMixin(DesktopAppChrome) {
  // TODO: document why we need a different handleKeydown than in WebApp
  _handleKeyDown (event) {
    // Handle custom keyboard shortcuts globally
    let archive = this.state.archive
    if (archive) {
      let manuscriptSession = archive.getEditorSession('manuscript')
      return manuscriptSession.keyboardManager.onKeydown(event)
    }
  }
}