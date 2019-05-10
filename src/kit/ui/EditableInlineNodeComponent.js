import EditableAnnotationComponent from './EditableAnnotationComponent'

export default class EditableInlineNodeComponent extends EditableAnnotationComponent {
  render ($$) {
    return $$('span')
  }

  _onSelectionStateChange (selectionState) {
    let surfaceId = selectionState.selection.surfaceId
    let node = selectionState.node
    if (((node && node === this.props.node) || (surfaceId && surfaceId.startsWith(this._surfaceId)))) {
      this._acquireOverlay({ anchor: this.el })
    } else {
      this._releaseOverlay()
    }
  }
}
