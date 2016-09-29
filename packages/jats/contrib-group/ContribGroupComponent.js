import { Component } from 'substance'
import renderNodeComponent from '../../../util/renderNodeComponent'

class ContribGroupComponent extends Component {
  didMount() {
    super.didMount()
    let node = this.props.node
    node.on('nodes:changed', this.rerender, this)
  }

  dispose() {
    super.dispose()
    let node = this.props.node
    node.off(this)
  }

  render($$) {
    let node = this.props.node
    let doc = node.getDocument()

    let el = $$('div')
      .addClass('sc-contrib-group')
      .attr('data-id', this.props.node.id)

    let children = node.nodes
    children.forEach(function(nodeId) {
      let childNode = doc.get(nodeId)
      if (childNode.type !== 'unsupported') {
        el.append(
          renderNodeComponent(this, $$, childNode, {
            disabled: this.props.disabled
          })
        )
      }
    }.bind(this))

    // el.append($$('button').addClass('se-add-author').append('Add Author'));
    return el
  }

}

export default ContribGroupComponent
