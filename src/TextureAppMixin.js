import { JATSImportDialog } from './article/index'
import Texture from './Texture'
import TextureArchive from './TextureArchive'

export default function TextureAppMixin (ParentAppChrome) {
  return class TextureApp extends ParentAppChrome {
    render ($$) {
      let el = $$('div').addClass('sc-app')
      let { archive, error } = this.state
      if (archive) {
        el.append(
          $$(Texture, { archive })
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

    _getArchiveClass () {
      return TextureArchive
    }
  }
}
