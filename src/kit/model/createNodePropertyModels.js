import { isNil, isFunction } from 'substance'
import createValueModel from './createValueModel'

export default function createNodePropertyModels (api, node, hooks = {}) {
  let properties = new Map()
  for (let p of node.getSchema()) {
    if (p.name === 'id') continue
    if (p.name === 'type') continue
    // EXPERIMENTAL: allowing to override creation of a property model
    // for the purpose of flattening....
    // TODO: this could also be done via option

    let hook = isFunction(hooks) ? hooks : hooks[p.name]

    if (hook) {
      let val = hook(p)
      // allow to skip properties by returning nil
      if (isNil(val)) continue

      if (val instanceof Map) {
        for (let [name, model] of val) {
          properties.set(name, model)
        }
      } else if (val._isValue) {
        properties.set(p.name, val)
      } else {
        // expecting either a single ValueModel, or a Map(name->ValueModel)
        throw new Error('Illegal value')
      }
    } else {
      let valueModel = createValueModel(api, [node.id, p.name], p)
      properties.set(p.name, valueModel)
    }
  }
  return properties
}
