import _ContainerModel from './_ContainerModel'

// Note: at this higher level, 'Container' is not a very good name because ot is not very specific
// We should come up with a name that makes clear that this is something that could be editied in a classical 'word-processor'.
// I.e. the content consists of a sequence of TextBlocks as well as blocks with other typically structured content.
// As a working title I'd suggest to use the term 'flow content' which is used in HTML for exactly this type of content
export default class CollectionValueModel extends _ContainerModel {
  get type () { return 'collection' }

  get id () { return this._path.join('.') }

  getItems () {
    return this._getItems()
  }

  getItemAt (idx) {
    let ids = this.getValue()
    let id = ids[idx]
    if (id) {
      return this._api.getModelById(id)
    }
  }

  addItem (item) {
    return this._api.addItemToCollection(this._prepareItem(item), this)
  }

  addItems (items) {
    return this._api.addItemsToCollection(items.map(item => this._prepareItem(item)), this)
  }

  removeItem (item) {
    this._api.removeItemFromCollection(item, this)
  }

  // TODO: consolidate Collection interface

  get isCollection () {
    return true
  }

  // TODO: change naming. Is the collection removable? probably rather an item. If it an item is removable the collection is mutable.
  get isRemovable () {
    return false
  }

  // TODO: change naming. Again, this sounds more like item isMovable() which in terms of the collection could be described isOrdered()
  // i.e. user can change order
  get isMovable () {
    return false
  }

  _prepareItem (item) {
    if (!item.type) {
      item.type = this._getItemType()
    }
    return item
  }

  _getItemType () {
    return this._targetTypes[0]
  }
}
