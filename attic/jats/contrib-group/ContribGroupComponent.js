import { Component } from 'substance'
import renderNodeComponent from '../../util/renderNodeComponent'

class ContribGroupComponent extends Component {
  didMount() {
    super.didMount()
    // Trigger rerender when nodes are modified
    this.context.editorSession.onRender('document', this.rerender, this, {
      path: [this.props.node.id, 'nodes']
    })
  }

  dispose() {
    super.dispose()
    this.context.editorSession.off(this)
  }

  render($$) {
    let node = this.props.node
    let doc = node.getDocument()

    let el = $$('div')
      .addClass('sc-contrib-group')
      .attr('data-id', this.props.node.id)

    let children = node.nodes
    children.forEach((nodeId) => {
      let childNode = doc.get(nodeId)
      if (childNode.type !== 'unsupported') {
        el.append(
          renderNodeComponent(this, $$, childNode, {
            disabled: this.props.disabled
          })
        )
      }
    })
    // el.append($$('button').addClass('se-add-author').append('Add Author'));
    return el
  }
}

export default ContribGroupComponent
