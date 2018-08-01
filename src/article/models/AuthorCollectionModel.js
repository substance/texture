import DefaultCollectionModel from './DefaultCollectionModel'

export default class AuthorCollectionModel extends DefaultCollectionModel {
  constructor(api, node) {
    super(api, node)
    this._node = node
  }

  addItem(item) {
    return this._api.addAuthor(item)
  }

  getItems() {
    return this._api.getAuthors()
  }

  removeItem(item) {
    return this._api.deleteAuthor(item.id)
  }

  _getCollectionId() {
    return 'authors'
  }

  _getCollectionType() {
    return 'author'
  }
}