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
}
