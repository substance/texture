import DefaultCollectionModel from './DefaultCollectionModel'

export default class SubjectCollectionModel extends DefaultCollectionModel {

  _getCollectionId() {
    return 'subjects'
  }

  _getCollectionType() {
    return '_subject'
  }
}