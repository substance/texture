import ValueComponent from './ValueComponent'
import getComponentForModel from './getComponentForModel'

export default class ChildComponent extends ValueComponent {
  render ($$) {
    const child = this.props.model.getChild()
    let ComponentClass = getComponentForModel(this.context, child)
    return $$(ComponentClass, {
      model: child,
      node: child._node
    })
  }
}
