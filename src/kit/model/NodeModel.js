import NodeModelProperty from './NodeModelProperty'

export default class NodeModel {
  constructor (api, node) {
    if (!node) throw new Error("'node' is required")
    this._api = api
    this._node = node

    this._properties = []
    this._propertiesByName = new Map()

    this._initialize()
  }

  get type () { return this._node.type }

  get id () { return this._node.id }

  getProperties () {
    return this._properties
  }

  _initialize () {
    const api = this._api
    const node = this._node
    const nodeSchema = node.getSchema()
    for (let nodeProperty of nodeSchema) {
      if (nodeProperty.name === 'id') continue
      let modelProperty = new NodeModelProperty(api, node, nodeProperty)
      this._properties.push(modelProperty)
      this._propertiesByName.set(modelProperty.name, modelProperty)
    }
  }

  _getPropertyModel (name) {
    return this._propertiesByName.get(name)
  }
}
