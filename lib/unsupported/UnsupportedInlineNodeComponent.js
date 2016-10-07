import { Component } from 'substance'

class UnsupportedInlineNodeComponent extends Component {

  render($$) {
    let el = $$('span')
      .addClass('sc-unsupported-inline-node')
      .attr('data-id', this.props.node.id)
      .attr('contenteditable', false)
      .append(
        '<'+this.props.node.tagName+'>'
      )
    return el
  }
}

export default UnsupportedInlineNodeComponent
