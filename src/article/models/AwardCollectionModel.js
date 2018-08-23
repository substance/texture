import DefaultCollectionModel from './DefaultCollectionModel'

export default class AwardCollectionModel extends DefaultCollectionModel {
  _getItemType () {
    return 'award'
  }
}
