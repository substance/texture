import {
  getQueryStringParam, substanceGlobals, platform
} from 'substance'
import { WebAppChrome, TextureReader, TextureArchive } from 'substance-texture'

window.addEventListener('load', () => {
  substanceGlobals.DEBUG_RENDERING = platform.devtools

  let app = TextureReaderApp.mount({
    archiveId: getQueryStringParam('archive') || 'kitchen-sink',
    storageType: getQueryStringParam('storage') || 'vfs',
    storageUrl: getQueryStringParam('storageUrl') || '/archives'
  }, window.document.body)

  // put the archive and some more things into global scope, for debugging
  setTimeout(() => {
    window.app = app
  }, 500)
})

export default class TextureReaderApp extends WebAppChrome {

  render($$) {
    let el = $$('div').addClass('sc-app')
    let { archive, error } = this.state

    if (archive) {
      el.append(
        $$(TextureReader, {
          archive,
        })
      )
    } else if (error) {
      el.append(
        'ERROR:',
        error.message
      )
    } else {
      // LOADING...
    }
    return el
  }

  _getArchiveClass() {
    return TextureArchive
  }

  _getDefaultDataFolder() {
    return './data/'
  }

}
