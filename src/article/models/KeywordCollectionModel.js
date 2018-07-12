import DefaultCollectionModel from './DefaultCollectionModel'

export default class KeywordCollectionModel extends DefaultCollectionModel {
  addItem(item) {
    return this._api.addKeyword(item)
  }

  removeItem(item) {
    return this._api.deleteKeyword(item.id)
  }

  _getCollectionId() {
    return 'keywords'
  }

  _getCollectionType() {
    return 'keyword'
  }
}