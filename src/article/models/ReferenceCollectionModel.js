import DefaultCollectionModel from './DefaultCollectionModel'

export default class ReferenceCollectionModel extends DefaultCollectionModel {
  getItems () {
    // TODO: do we expect this to be sorted?
    return super.getItems()
  }

  addItem (item) {
    return this._api.addItemToCollection(item, this)
  }

  addItems (items) {
    return this._api.addItemsToCollection(items, this)
  }

  removeItem (item) {
    this._api.deleteReference(item, this)
  }
}
