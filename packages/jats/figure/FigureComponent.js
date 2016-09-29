import { Component } from 'substance'
import renderNodeComponent from '../../../util/renderNodeComponent'

class FigureComponent extends Component {

  render($$) {
    let node = this.props.node
    let doc = node.getDocument()
    let el = $$('div')
      .addClass('sc-figure')
      .attr('data-id', this.props.node.id)

    if (node.label) {
      let label = doc.get(node.label)
      el.append(
        renderNodeComponent(this, $$, label, {
          disabled: this.props.disabled
        }).ref('label')
      )
    }

    // Display figure content
    node.contentNodes.forEach(function(nodeId) {
      let childNode = doc.get(nodeId)
      el.append(
        renderNodeComponent(this, $$, childNode, {
          disabled: this.props.disabled
        })
      )
    }.bind(this))

    // Display Captions
    node.captions.forEach(function(nodeId) {
      let captionNode = doc.get(nodeId)
      el.append(
        renderNodeComponent(this, $$, captionNode, {
          disabled: this.props.disabled
        }).ref('caption')
      )
    }.bind(this))

    // TODO: we should provide a UI to the rest of the node's content
    // in an overlay
    return el
  }
}

export default FigureComponent
