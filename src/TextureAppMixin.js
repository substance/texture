import { isNil, $$ } from 'substance'
import Texture from './Texture'
import TextureArchive from './TextureArchive'

export default function TextureAppMixin (ParentAppChrome) {
  return class TextureApp extends ParentAppChrome {
    render () {
      let el = $$('div').addClass('sc-app')
      let { archive, error } = this.state
      let editable = isNil(this.props.editable) ? true : this.props.editable
      if (archive) {
        const config = this._config
        const Texture = this._getAppClass()
        el.append(
          $$(Texture, { config, archive, editable }).ref('texture')
        )
      } else if (error) {
        let ErrorRenderer = this.getComponent(error.type)
        if (ErrorRenderer) {
          el.append(
            $$(ErrorRenderer, { error })
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
