import DefaultCollectionModel from './DefaultCollectionModel'

export default class AuthorCollectionModel extends DefaultCollectionModel {
  constructor (api, node) {
    super(api, node)
    this._node = node
  }

  addItem (item) {
    return this._api.addAuthor(item)
  }

  getItems () {
    return this._node._childNodes.map(id => this._api._getModelById(id))
  }

  removeItem (item) {
    // TODO: add a method to ArticleAPI such as api.removeItemFromCollection(item, this)
    console.error('FIXME: Implement AuthorCollectionModel.removeItem()')
  }

  _getCollectionId() {
    return 'authors'
  }

  _getCollectionType() {
    return 'author'
  }
}