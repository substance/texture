import DefaultCollectionModel from './DefaultCollectionModel'

export default class AuthorCollectionModel extends DefaultCollectionModel {
  constructor(api, node) {
    super(api, node)
    this._node = node
  }

  addItem(item) {
    return this._api.addPerson(item, 'author')
  }

  getItems() {
    return this._api.getPersons('author')
  }

  _getCollectionId() {
    return 'authors'
  }

  _getCollectionType() {
    return 'author'
  }
}