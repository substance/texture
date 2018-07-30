import DefaultCollectionModel from './DefaultCollectionModel'

export default class SubjectCollectionModel extends DefaultCollectionModel {
  addItem(item) {
    return this._api.addSubject(item)
  }

  removeItem(item) {
    return this._api.deleteSubject(item.id)
  }

  _getCollectionId() {
    return 'subjects'
  }

  _getCollectionType() {
    return '_subject'
  }
}