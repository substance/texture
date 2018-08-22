import { NodeComponent } from '../../kit'

export default class ElementNodeComponent extends NodeComponent {
  render ($$) {
    let el = $$(this.getTagName())
      .addClass(this.getClassNames())
    this._getChildren().forEach(child => {
      el.append(
        $$(this.getComponent(child.type), {
          node: child
        }).ref(child.id)
      )
    })
    return el
  }

  _getChildren () {
    return this.props.node.getChildren()
  }

  getTagName () {
    return this.props.node.type
  }

  getClassNames () {
    return `sc-${this.props.node.type}`
  }
}
