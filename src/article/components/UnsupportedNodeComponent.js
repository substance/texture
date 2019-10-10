import { Component, $$ } from 'substance'
import IsolatedNodeComponent from '../../kit/ui/_IsolatedNodeComponent'

export default class UnsupportedNodeComponent extends IsolatedNodeComponent {
  _getContentClass () {
    return UnsupportedContentComponent
  }
}

class UnsupportedContentComponent extends Component {
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
    let el = $$('div').addClass('sc-unsupported').append(
      $$('pre').text(data)
    ).attr({
      'data-id': node.id,
      'contenteditable': false
    })

    return el
  }
}
