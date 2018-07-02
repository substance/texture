import { JATSImportDialog } from './article/index'

export default function TextureAppMixin (ParentAppChrome) {
  return class TextureApp extends ParentAppChrome {
    render ($$) {
      console.log("TextureApp.render()")
      console.log(this);
      let el = $$('div').addClass('sc-app')
      let { archive, error } = this.state
      if (archive) {
        const Texture = this.props.appClass
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
  }
}
