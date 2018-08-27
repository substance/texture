export default function getComponentForModel (context, model) {
  let componentRegistry = context.componentRegistry
  let ComponentClass = componentRegistry.get(model.type)
  if (!ComponentClass) {
    let node = model._node
    if (node) {
      let superTypes = node.getSchema().getSuperTypes()
      for (let superType of superTypes) {
        ComponentClass = componentRegistry.get(superType)
        if (ComponentClass) break
      }
    }
  }
  if (!ComponentClass) {
    throw new Error(`No Component class registered for model type ${model.type}.`)
  }
  return ComponentClass
}
