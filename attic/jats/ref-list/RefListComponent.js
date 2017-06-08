import { Component } from 'substance'
import renderNodeComponent from '../../util/renderNodeComponent'

class RefListComponent extends Component {
  didMount() {
    super.didMount()
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
    let el = $$('div').addClass('sc-ref-list')

    // NOTE: We don't yet expose RefList.label to the editor
    if (node.title) {
      let titleNode = doc.get(node.title)
      el.append(
        renderNodeComponent(this, $$, titleNode, {
          disabled: this.props.disabled
        })
      )
    }

    // Ref elements
    let children = node.nodes
    children.forEach(function(nodeId) {
      let childNode = doc.get(nodeId)
      if (childNode.type !== 'unsupported') {
        el.append(
          renderNodeComponent(this, $$, childNode, {
            disabled: this.props.disabled
          })
        )
      } else {
        console.info(childNode.type+ ' inside <ref-list> currently not supported by the editor.')
      }
    }.bind(this))

    return el
  }
}

// Isolated Nodes config
RefListComponent.fullWidth = true
RefListComponent.noStyle = true

export default RefListComponent
