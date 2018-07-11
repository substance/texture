import DefaultCollectionModel from './DefaultCollectionModel'

export default class AuthorCollectionModel extends DefaultCollectionModel {
  constructor(api, node) {
    super(api, node)
    this._node = node
  }

  getItems() {
    return this._api.getAuthors()
  }

  _getCollectionId() {
    return 'authors'
  }

  _getCollectionType() {
    return 'author'
  }
}