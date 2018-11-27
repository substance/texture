import { TextPropertyEditor as SubstanceTextPropertyEditor } from 'substance'
import ModifiedSurface from './_ModifiedSurface'

/*
  Overridden version of Substance.TextPropertyEditor to support Models and new AppState API
*/
export default class TextPropertyEditorNew extends ModifiedSurface(SubstanceTextPropertyEditor) {
  // overriding event registration
  didMount () {
    super.didMount()

    let appState = this.context.appState
    appState.addObserver(['selection'], this._onSelectionChanged, this, {
      stage: 'render'
    })
  }

  dispose () {
    super.dispose()

    this.context.appState.off(this)
  }

  render ($$) {
    let el = super.render($$)
    if (this.isEditable()) {
      el.addClass('sm-editable')
    } else {
      el.addClass('sm-readonly')
      // HACK: removing contenteditable if not editable
      // TODO: we should fix substance.TextPropertyEditor to be consistent with props used in substance.Surface
      el.setAttribute('contenteditable', false)
    }
    return el
  }
}
