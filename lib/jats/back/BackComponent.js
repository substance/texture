import { Component } from 'substance'
import renderNodeComponent from '../../util/renderNodeComponent'

class BackComponent extends Component {

  render($$) {
    let node = this.props.node
    let doc = node.getDocument()

    let el = $$('div')
      .addClass('sc-back')
      .attr('data-id', this.props.node.id)

    // Ref elements
    let children = node.nodes
    children.forEach(function(nodeId) {
      let childNode = doc.get(nodeId)
      if (childNode.type !== 'unsupported') {
        el.append(
          renderNodeComponent(this, $$, childNode, {
            disabled: this.props.disabled
          })
        );
      } else {
        console.info(childNode.tagName+ ' inside <back> currently not supported by the editor.')
      }
    }.bind(this))

    return el
  }
}

export default BackComponent
