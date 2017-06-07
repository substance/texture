import { Component } from 'substance'

export default class UnsupportedInlineNodeComponent extends Component {

  render($$) {
    const node = this.props.node
    let el = $$('span').addClass('sc-unsupported-inline-node')
      .attr('data-id', node.id)
    el.append(
      $$('pre').text(node.toXML().serialize())
    )
    return el
  }

}