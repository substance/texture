import NodeComponent from '../shared/NodeComponent'

export default class ListItemComponent extends NodeComponent {
  render ($$) {
    const TextPropertyComponent = this.getComponent('text-property')
    const node = this.props.node
    const path = node.getPath()
    let el = $$('li').addClass('sc-list-item')
    el.append(
      $$(TextPropertyComponent, {
        path,
        doc: node.getDocument()
      }).ref('text')
    )
    // for nested lists
    if (this.props.children) {
      el.append(this.props.children)
    }
    return el
  }
}
