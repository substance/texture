import DefaultCollectionModel from './DefaultCollectionModel'

export default class GroupCollectionModel extends DefaultCollectionModel {
  _getItemType () {
    return 'group'
  }
}
