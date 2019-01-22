import ValueComponent from './ValueComponent'
import getComponentForModel from './getComponentForModel'

export default class ChildComponent extends ValueComponent {
  render ($$) {
    const child = this.props.model.getChild()
    let ComponentClass = getComponentForModel(this.context, child)
    let props = Object.assign({}, this.props)
    props.node = child
    delete props.model
    return $$(ComponentClass, props)
  }
}
