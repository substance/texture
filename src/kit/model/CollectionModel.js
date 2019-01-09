import _ContainerModel from './_ContainerModel'

export default class CollectionModel extends _ContainerModel {
  get type () { return 'collection' }

  getItems () {
    return this._getItems()
  }

  addItem (item) {
    this._api._appendChild(this._path, item)
  }

  removeItem (item) {
    this._api._removeChild(this._path, item)
  }
}
