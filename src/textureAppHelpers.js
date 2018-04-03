import Texture from './Texture'
import JATSImportDialog from './converter/JATSImportDialog'

export function _renderTextureApp($$, app) {
  let el = $$('div').addClass('sc-app')
  let { archive, error } = app.state

  if (archive) {
    el.append(
      $$(Texture, {
        archive
      })
    )
  } else if (error) {
    if (error.type === 'jats-import-error') {
      el.append(
        $$(JATSImportDialog, { errors: error.detail })
      )
    } else {
      el.append(
        'ERROR:',
        error.message
      )
    }
  } else {
    // LOADING...
  }
  return el
}
