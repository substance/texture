import throwMethodIsAbstract from '../shared/throwMethodIsAbstract'
import AnnotationComponent from './AnnotationComponent'
import NodeComponentMixin from './NodeComponentMixin'

/**
 * A component that renders an editor in an overlay when the selection is on the annotation.
 * In contrast to most annotations, which are just toggled on/off, there are specific annotions
 * which have data attached that has to be edited in a popover, e.g. external links.
 * Note: this is experimental. I want to move away from popups driven by commands and tools.
 * On one hand, these commands were always kind of a extra overhead, without any effect other than
 * to determine if the tool should be displayed or not.
 * Furthermore, our need for more complex editors for such popover was increasing (keywords editor, inline-cell editor, etc.)
 */
export default class EditableAnnotationComponent extends NodeComponentMixin(AnnotationComponent) {
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

    // a detached editor component
    this._editor = this._createEditor()
    // .. that we will attach to the OverlayCanvas whenever the selection is on the annotation
    // TODO: similar as with IsolatedNodes and InlineNodes, the number of listeners will grow with
    // the size of the document. Thus, we need to introduce a means to solve this more efficiently
    this.context.appState.addObserver(['selectionState'], this._onSelectionStateChange, this, { stage: 'pre-render' })
  }

  dispose () {
    super.dispose()

    if (this._editor) {
      this._releaseOverlay()
      this._editor.triggerDispose()
      this._editor = null
    }
  }

  _onSelectionStateChange (selectionState) {
    let surfaceId = selectionState.selection.surfaceId
    let isSelected = selectionState.annos.indexOf(this.props.node) !== -1
    if ((isSelected || (surfaceId && surfaceId.startsWith(this._surfaceId)))) {
      // omitting the anchor leads to anchoring at the cursor position
      // however, for now I'd like to stick to element related anchoring
      // (as with inline nodes), as this is not thought through 100%.
      // Problem is, that when the selection is inside the popover, it can't be anchored
      // relative to the cursor. Anchoring with the el leads to a jump then.
      // To solve this we would need retain the first anchor and
      // and not use the element. In case of Undo however, there is no selection rectangle
      // this._acquireOverlay({ anchor: isSelected ? null : this.el })

      // Thus, for now we always position relative to the element.
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
