import { NodeComponent } from 'substance'

export default class ElementNodeComponent extends NodeComponent {

  render($$) {
    const node = this.props.node
    let el = $$(this.getTagName())
      .addClass(this.getClassNames())
    node.getChildren().forEach(child => {
      el.append(
        $$(this.getComponent(child.type), {
          node: child
        }).ref(child.id)
      )
    })
    return el
  }

  getTagName() {
    return this.props.node.type
  }

  getClassNames() {
    return `sc-${this.props.node.type}`
  }

}
