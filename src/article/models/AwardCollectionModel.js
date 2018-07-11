import DefaultCollectionModel from './DefaultCollectionModel'

export default class AwardCollectionModel extends DefaultCollectionModel {
  addItem(item) {
    return this._api.addAward(item)
  }

  _getCollectionId() {
    return 'awards'
  }

  _getCollectionType() {
    return 'award'
  }
}