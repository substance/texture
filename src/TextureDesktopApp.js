import { InMemoryDarBuffer } from 'substance'
import DesktopAppChrome from './DesktopAppChrome'
import TextureArchive from './TextureArchive'

import {
  _renderTextureApp,
  _handleKeyDown
} from './textureAppHelpers'

export default class TextureDesktopApp extends DesktopAppChrome {

  render($$) {
    return _renderTextureApp($$, this)
  }

  _loadArchive(archiveId, context) {
    let storage = new this.props.FSStorageClient()
    let buffer = new InMemoryDarBuffer()
    let archive = new TextureArchive(storage, buffer, context)
    // HACK: this should be done earlier in the lifecycle (after first didMount)
    // and later disposed properly. However we can accept this for now as
    // the app lives as a singleton atm.
    // NOTE: _archiveChanged is implemented by DesktopAppChrome
    archive.on('archive:changed', this._archiveChanged, this)
    return archive.load(archiveId)
  }

  _handleKeyDown(event) {
    return _handleKeyDown(event, this)
  }

}
