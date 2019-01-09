export default function renderModel ($$, comp, valueModel, options = {}) {
  let ValueComponent = comp.getComponent(valueModel.type)
  let props = Object.assign({
    disabled: comp.props.disabled,
    // TODO: renamve 'model' to 'value' (then we have it is clear when node and when values are used)
    model: valueModel
  }, options)
  return $$(ValueComponent, props)
}
