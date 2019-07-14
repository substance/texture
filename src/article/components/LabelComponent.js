import { Component } from 'substance'
import { getLabel } from '../shared/nodeHelpers'

// TODO: we need to rethink how we model labels
// ATM, we have it in the schema, but we are using node state
export default class LabelComponent extends Component {
  didMount () {
    this.context.editorState.addObserver(['document'], this.rerender, this, { stage: 'render', document: { path: [this.props.node.id] } })
  }

  dispose () {
    this.context.editorState.removeObserver(this)
  }

  render ($$) {
    const label = getLabel(this.props.node)
    return $$('div').addClass('sc-label').text(label)
  }
}
