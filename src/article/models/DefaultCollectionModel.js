export default class DefaultCollectionModel {
  constructor (api, node) {
    this._api = api
    this._node = node
  }

  get id() {
    return this._getCollectionId()
  }

  get isCollection() {
    return true
  }

  get type() {
    return 'collection'
  }

  getItems() {
    return this._node._childNodes.map(id => this._api._getModelById(id))
  }

  addItem(item = {}) {
    const itemType = this._getCollectionType()
    item.type = itemType
    return this._api._addModel(item)
  }

  removeItem(item) {
    return this._api._removeModel(item)
  }
}