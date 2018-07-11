import DefaultCollectionModel from './DefaultCollectionModel'

export default class GroupCollectionModel extends DefaultCollectionModel {

  addItem(item) {
    return this._api.addEntity(item, 'group')
  }

  _getCollectionId() {
    return 'groups'
  }

  _getCollectionType() {
    return 'group'
  }
}