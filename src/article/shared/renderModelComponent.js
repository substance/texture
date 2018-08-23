import getComponentForModel from './getComponentForModel'

export default function renderModelComponent (context, $$, props) {
  const model = props.model
  if (!model) throw new Error("'props.model' is required")
  let ModelComponent = getComponentForModel(context, model)
  if (ModelComponent) {
    // LEGACY
    props.node = model._node
    return $$(ModelComponent, props)
  } else {
    return $$('div')
  }
}
