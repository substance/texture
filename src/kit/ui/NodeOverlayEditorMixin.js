import throwMethodIsAbstract from '../shared/throwMethodIsAbstract'

export default function (NodeComponent) {
  return class NodeComponentWithOverlayEditor extends NodeComponent {
    constructor (...args) {
      super(...args)

      this._surfaceId = this.context.parentSurfaceId + '/' + this.props.node.id
    }

    getChildContext () {
      return {
        parentSurfaceId: this._surfaceId
      }
    }

    didMount () {
      super.didMount()

      if (this._shouldEnableOverlayEditor()) {
        // a detached editor component
        this._editor = this._createEditor()
        // .. that we will attach to the OverlayCanvas whenever the selection is on the annotation
        // TODO: similar as with IsolatedNodes and InlineNodes, the number of listeners will grow with
        // the size of the document. Thus, we need to introduce a means to solve this more efficiently
        this.context.appState.addObserver(['selectionState'], this._onSelectionStateChange, this, { stage: 'pre-render' })
      }
    }

    dispose () {
      super.dispose()

      if (this._editor) {
        this._releaseOverlay()
        this._editor.triggerDispose()
        this._editor = null
      }
    }

    _shouldEnableOverlayEditor () { return true }

    _onSelectionStateChange (selectionState) {
      let surfaceId = selectionState.selection.surfaceId
      let isSelected = selectionState.node === this.props.node
      if ((isSelected || (surfaceId && surfaceId.startsWith(this._surfaceId)))) {
        this._acquireOverlay({ anchor: this.el })
      } else {
        this._releaseOverlay()
      }
    }

    _getEditorClass () { throwMethodIsAbstract() }

    _createEditor () {
      let EditorClass = this._getEditorClass()
      // keep a rendered editor around
      let editor = new EditorClass(this, { node: this.props.node })
      editor._render()
      editor.triggerDidMount()
      return editor
    }

    _acquireOverlay (options) {
      this.context.editor.refs.overlay.acquireOverlay(this._editor, options)
    }

    _releaseOverlay () {
      this.context.editor.refs.overlay.releaseOverlay(this._editor)
    }
  }
}
