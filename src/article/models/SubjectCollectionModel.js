import DefaultMovableCollectionModel from './DefaultMovableCollectionModel'

export default class SubjectCollectionModel extends DefaultMovableCollectionModel {
  _getItemType () {
    return 'subject'
  }

  get isRemovable () {
    return true
  }
}
