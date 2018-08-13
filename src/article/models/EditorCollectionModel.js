import DefaultCollectionModel from './DefaultCollectionModel'

export default class EditorCollectionModel extends DefaultCollectionModel {
  constructor (api, node) {
    super(api, node)
    this._node = node
  }

  addItem (item = {}) {
    item.type = 'person'
    return this._api.addItemToCollection(item, this)
  }

  getItems () {
    return this._node._childNodes.map(id => this._api._getModelById(id))
  }

  removeItem (item) {
    this._api.removeItemFromCollection(item, this)
  }

  _getCollectionId () {
    return 'editors'
  }

  _getCollectionType () {
    return 'editor'
  }
}
