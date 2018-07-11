import DefaultCollectionModel from './DefaultCollectionModel'

export default class GroupCollectionModel extends DefaultCollectionModel {

  _getCollectionId() {
    return 'groups'
  }

  _getCollectionType() {
    return 'group'
  }
}