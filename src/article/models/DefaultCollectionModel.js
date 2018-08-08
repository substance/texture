export default class DefaultCollectionModel {
  constructor(api) {
    this._api = api
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
    return this._api.getEntitiesByType(this._getCollectionType())
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