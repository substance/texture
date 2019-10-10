import { Component, $$ } from 'substance'

export default class UnsupportedInlineNodeComponent extends Component {
  render () {
    const node = this.props.node
    let data
    if (node._isXMLNode) {
      data = node.toXML().serialize()
    } else if (node.data) {
      data = node.data
    } else {
      data = JSON.stringify(node.toJSON())
    }
    let el = $$('span').addClass('sc-unsupported-inline-node').append(
      $$('code').text(data)
    ).attr({
      'data-id': node.id,
      contenteditable: false
    })
    return el
  }
}
