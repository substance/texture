import DefaultCollectionModel from './DefaultCollectionModel'

export default class EditorCollectionModel extends DefaultCollectionModel {
  addItem (item = {}) {
    item.type = 'person'
    return this._api.addItemToCollection(item, this)
  }

  _getCollectionId () {
    return 'editors'
  }

  _getCollectionType () {
    return 'editor'
  }
}
