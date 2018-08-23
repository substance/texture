import DefaultCollectionModel from './DefaultCollectionModel'

export default class AuthorCollectionModel extends DefaultCollectionModel {
  addItem (item = {}) {
    item.type = 'person'
    return this._api.addItemToCollection(item, this)
  }

  _getCollectionId () {
    return 'authors'
  }

  _getCollectionType () {
    return 'author'
  }
}
