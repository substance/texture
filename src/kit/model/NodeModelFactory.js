import NodeModel from './NodeModel'

const MODELCLASS_CACHE = new Map()

export default class NodeModelFactory {
  static create (api, node) {
    let ModelClass = MODELCLASS_CACHE.get(node.type)
    if (!ModelClass) {
      class _GeneratedModel extends NodeModel {}
      let nodeSchema = node.getSchema()
      for (let prop of nodeSchema) {
        // skip id and type
        if (prop.name === 'id') continue
        _GeneratedModel.prototype[_getter(prop.name)] = function () {
          return this._getPropertyModel(prop.name)
        }
      }
      ModelClass = _GeneratedModel
      MODELCLASS_CACHE.set(node.type, ModelClass)
    }
    return new ModelClass(api, node)
  }
}

function _getter (name) {
  return ['get', name[0].toUpperCase(), name.slice(1)].join('')
}
