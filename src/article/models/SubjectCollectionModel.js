import DefaultCollectionModel from './DefaultCollectionModel'

export default class SubjectCollectionModel extends DefaultCollectionModel {
  _getItemType () {
    return 'subject'
  }
}
