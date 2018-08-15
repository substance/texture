import DefaultCollectionModel from './DefaultCollectionModel'

export default class TranslateableCollectionModel extends DefaultCollectionModel {
  getItems () {
    return this._api.getTranslatables()
  }

  _getCollectionId () {
    return 'translateables'
  }
}
