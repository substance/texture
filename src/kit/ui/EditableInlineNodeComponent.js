import { $$ } from 'substance'
import NodeComponent from './NodeComponent'
import NodeOverlayEditorMixin from './NodeOverlayEditorMixin'

export default class EditableInlineNodeComponent extends NodeOverlayEditorMixin(NodeComponent) {
  render () {
    return $$('span').attr('data-id', this.props.node.id)
  }
}
