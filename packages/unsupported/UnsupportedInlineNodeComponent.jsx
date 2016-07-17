import Component from 'substance/ui/Component'

class UnsupportedInlineNodeComponent extends Component {

  render($$) {
    return (
      <span class="sc-unsupported-inline-node"
        data-id="{this.props.node.id}"
        contenteditable="false">&lt;{this.props.node.tagName}&gt;</span>
    )
  }
}

export default UnsupportedInlineNodeComponent
