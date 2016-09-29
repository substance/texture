import { Component, TextPropertyComponent } from 'substance'
import renderNodeComponent from '../../../util/renderNodeComponent'

class FootnoteComponent extends Component {

  render($$) {
    let node = this.props.node
    let doc = node.getDocument()

    let el = $$('div')
      .addClass('sc-footnote')
      .attr('data-id', this.props.node.id)

    if (node.label) {
      let label = doc.get(node.label)
      el.append($$(TextPropertyComponent, {
        path: label.getTextPath()
      }))
    }
    // TODO: what if no label is present?

    this.props.node.nodes.forEach(function(nodeId) {
      let childNode = doc.get(nodeId)
      el.append(
        renderNodeComponent(this, $$, childNode, {
          disabled: this.props.disabled
        })
      );
    }.bind(this))

    return el
  }
}

export default FootnoteComponent
