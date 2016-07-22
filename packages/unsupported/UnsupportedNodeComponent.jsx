import Component from 'substance/ui/Component'

class UnsupportedNodeComponent extends Component {

  render($$) {
    return (
      <span class="sc-unsupported-inline-node"
        data-id="{this.props.node.id}"
        contenteditable="false">
        <button class="se-toggle"><pre><code>{this.props.node.tagName}</code></pre></button>
      </span>
    )
  }

}

UnsupportedNodeComponent.fullWidth = true
UnsupportedNodeComponent.noStyle = true

export default UnsupportedNodeComponent
