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

export function _handleKeyDown(event, app) {
  // Handle custom keyboard shortcuts globally
  let archive = app.state.archive
  if (archive) {
    let manuscriptSession = archive.getEditorSession('manuscript')
    return manuscriptSession.keyboardManager.onKeydown(event)
  }
}
