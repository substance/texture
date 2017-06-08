import { Component } from 'substance'

export default class UnsupportedNodeComponent extends Component {

  render($$) {
    const node = this.props.node
    let el = $$('div').addClass('sc-unsupported')
      .attr('data-id', node.id)
    el.append(
      $$('pre').text(node.toXML().serialize())
    )
    return el
  }

}