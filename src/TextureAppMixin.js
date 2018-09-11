import Texture from './Texture'
import TextureArchive from './TextureArchive'
import { JATSImportDialog } from './article'

export default function TextureAppMixin (ParentAppChrome) {
  return class TextureApp extends ParentAppChrome {
    render ($$) {
      let el = $$('div').addClass('sc-app')
      let { archive, error } = this.state
      if (archive) {
        const Texture = this._getAppClass()
        el.append(
          $$(Texture, { archive }).ref('texture')
        )
      } else if (error) {
        if (error.type === 'jats-import-error') {
          el.append(
            $$(JATSImportDialog, { errors: error.detail })
          )
        } else {
          el.append('ERROR:', error.message)
        }
      } else {
        // LOADING...
      }
      return el
    }

    _getAppClass () {
      return Texture
    }

    _getArchiveClass () {
      return TextureArchive
    }
  }
}
