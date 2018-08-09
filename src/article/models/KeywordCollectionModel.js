import DefaultCollectionModel from './DefaultCollectionModel'

export default class KeywordCollectionModel extends DefaultCollectionModel {

  _getCollectionId() {
    return 'keywords'
  }

  _getCollectionType() {
    return 'keyword'
  }
}