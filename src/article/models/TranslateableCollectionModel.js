import DefaultCollectionModel from './DefaultCollectionModel'

export default class TranslateableCollectionModel extends DefaultCollectionModel {
  addItem (item) {
    this._api.addTranslation(item.type, item.lanaguage)
  }

  removeItem (item) { // eslint-disable-line no-unused-vars
  }

  getItems () {
    return this._api.getTranslatables()
  }

  _getCollectionId () {
    return 'translateables'
  }
}
