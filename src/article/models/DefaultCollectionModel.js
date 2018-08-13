export default class DefaultCollectionModel {
  constructor (api, node) {
    this._api = api
    this._node = node
  }

  get id () {
    return this._getCollectionId()
  }

  get isCollection () {
    return true
  }

  get type () {
    return 'collection'
  }

  getItems () {
    return this._node._childNodes.map(id => this._api._getModelById(id))
  }

  addItem (item = {}) {
    item.type = this._getCollectionType()
    return this._api.addItemToCollection(item, this)
  }

  removeItem (item) {
    this._api.removeItemFromCollection(item, this)
  }

  _getCollectionType () {
    return 'collection'
  }
}
