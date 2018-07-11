import DefaultCollectionModel from './DefaultCollectionModel'

export default class SubjectCollectionModel extends DefaultCollectionModel {
  addItem(item) {
    return this._api.addSubject(item)
  }

  _getCollectionId() {
    return 'subjects'
  }

  _getCollectionType() {
    return 'subject'
  }
}