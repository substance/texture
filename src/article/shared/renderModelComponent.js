export default function renderModelComponent (context, $$, props) {
  const componentRegistry = context.componentRegistry
  const model = props.model
  let ModelComponent = componentRegistry.get(model.type)
  if (ModelComponent) {
    // LEGACY
    props.node = model._node
    return $$(ModelComponent, props)
  } else {
    return $$('div')
  }
}
