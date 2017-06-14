import { Component, IsolatedNodeComponent } from 'substance'

export default class UnsupportedNodeComponent extends IsolatedNodeComponent {
  _getContentClass() {
    return UnsupportedContentComponent
  }
}

class UnsupportedContentComponent extends Component {

  render($$) {
    const node = this.props.node
    let el = $$('div').addClass('sc-unsupported')
      .attr('data-id', node.id)
      .attr('contenteditable', false)
    el.append(
      $$('pre').text(node.toXML().serialize())
    )
    return el
  }

}