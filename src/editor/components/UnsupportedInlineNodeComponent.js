import { Component } from 'substance'

export default class UnsupportedInlineNodeComponent extends Component {

  render($$) {
    const node = this.props.node
    let el = $$('span').addClass('sc-unsupported-inline-node').append(
      $$('pre').text(node.toXML().serialize())
    ).attr('data-id', node.id)

    return el
  }

}
