import { NodeComponent } from '../../kit'

export default class ListItemComponent extends NodeComponent {
  render ($$) {
    const node = this.props.node
    const doc = node.getDocument()
    const path = node.getPath()
    const TextPropertyComponent = this.getComponent('text-property')

    let el = $$('li').addClass('sc-list-item')
    el.append(
      $$(TextPropertyComponent, {
        doc,
        name: path.join('.'),
        path
      }).ref('text')
    )
    // for nested lists
    if (this.props.children) {
      el.append(this.props.children)
    }
    return el
  }
}
