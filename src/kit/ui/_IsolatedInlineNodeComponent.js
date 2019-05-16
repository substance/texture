import { IsolatedInlineNodeComponent as SubstanceIsolatedInlineNodeComponent } from 'substance'

/*
  This is overriding Substance.IsolatedInlineNodeComponent to support Models.
*/
export default class IsolatedInlineNodeComponentNew extends SubstanceIsolatedInlineNodeComponent {
  // overriding AbstractIsolatedNodeComponent.didMount() because it uses deprecated EditorSession.onRender()
  didMount () {
    let appState = this.context.appState
    appState.addObserver(['selection'], this._onSelectionChanged, this, { stage: 'render' })
  }

  // overriding AbstractIsolatedNodeComponent.dispose() because it uses EditorSession.off() in a way which has been deprecated
  dispose () {
    this.context.appState.off(this)
  }

  render ($$) {
    let el = super.render($$)
    // HACK: substnace IsoloatedInlineNodeComponent does not listen on click, but IMO this should be the case.
    // TODO instead of this HACK fix the implementation in Substance Land
    if (!this.isDisabled()) {
      el.on('click', this.onClick)
    }
    return el
  }
}
