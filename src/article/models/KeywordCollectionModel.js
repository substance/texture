import DefaultMovableCollectionModel from './DefaultMovableCollectionModel'

export default class KeywordCollectionModel extends DefaultMovableCollectionModel {
  _getItemType () {
    return 'keyword'
  }

  get isRemovable () {
    return true
  }
}
