import DefaultCollectionModel from './DefaultCollectionModel'

export default class AwardCollectionModel extends DefaultCollectionModel {
  addItem(item) {
    return this._api.addAward(item)
  }

  removeItem(item) {
    return this._api.deleteAward(item.id)
  }

  _getCollectionId() {
    return 'awards'
  }

  _getCollectionType() {
    return 'award'
  }
}