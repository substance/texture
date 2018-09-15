export default class DefaultCollectionModel {
  constructor (api, node) {
    this._api = api
    this._node = node
  }

  get id () {
    return this._node.id
  }

  get type () {
    return this._node.type
  }

  get isCollection () {
    return true
  }

  get isRemovable () {
    return false
  }

  get isMovable () {
    return false
  }

  get length () {
    return this._node.children.length
  }

  getItems () {
    return this._node._childNodes.map(id => this._api.getModelById(id))
  }

  addItem (item = {}) {
    return this._api.addItemToCollection(this._prepareItem(item), this)
  }

  addItems (items) {
    return this._api.addItemsToCollection(items.map(item => this._prepareItem(item)), this)
  }

  removeItem (item) {
    this._api.removeItemFromCollection(item, this)
  }

  _prepareItem (item) {
    item.type = this._getItemType()
    return item
  }

  _getItemType () {
    throw new Error('This method is abstract.')
  }
}
