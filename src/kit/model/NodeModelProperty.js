import createValueModel from './createValueModel'

export default class NodeModelProperty {
  constructor (api, node, nodeProperty) {
    this._api = api
    this._node = node
    this._nodeProperty = nodeProperty
    this._valueModel = this._createValueModel()
  }

  get name () { return this._nodeProperty.name }

  get type () { return this._valueModel.type }

  get model () { return this._valueModel }

  get targetTypes () { return this._nodeProperty.targetTypes || [] }

  isRequired () {
    return this._api._isPropertyRequired(this._node.type, this.name)
  }
  isEmpty () {
    return this._valueModel.isEmpty()
  }
  _createValueModel () {
    const api = this._api
    const nodeProperty = this._nodeProperty
    const path = [this._node.id, this.name]
    let type = nodeProperty.type
    if (nodeProperty.isReference()) {
      if (nodeProperty.isArray()) {
        if (nodeProperty.isOwned()) {
          type = 'children'
        } else {
          type = 'many-relationship'
        }
      } else {
        type = 'single-relationship'
      }
    }
    return createValueModel(api, type, path, nodeProperty.targetTypes)
  }
}
