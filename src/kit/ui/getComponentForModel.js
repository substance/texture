export default function getComponentForModel (context, model) {
  let componentRegistry = context.componentRegistry
  let ComponentClass = componentRegistry.get(model.type)
  if (!ComponentClass) {
    throw new Error(`No Component class registered for model type ${model.type}.`)
  }
  return ComponentClass
}
