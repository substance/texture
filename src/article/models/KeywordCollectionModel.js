import DefaultCollectionModel from './DefaultCollectionModel'

export default class KeywordCollectionModel extends DefaultCollectionModel {
  _getItemType () {
    return 'keyword'
  }
}
