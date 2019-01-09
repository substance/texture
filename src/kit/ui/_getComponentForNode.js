export default function getComponentForNode (comp, node) {
  let componentRegistry = comp.context.componentRegistry
  let ComponentClass = componentRegistry.get(node.type)
  if (!ComponentClass) {
    let superTypes = node.getSchema().getSuperTypes()
    for (let superType of superTypes) {
      ComponentClass = componentRegistry.get(superType)
      if (ComponentClass) break
    }
  }
  if (!ComponentClass) {
    throw new Error(`No Component class registered for model type ${node.type}.`)
  }
  return ComponentClass
}
