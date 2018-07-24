export default class DefaultCollectionModel {
  constructor(api) {
    this._api = api
  }

  get id() {
    return this._getCollectionId()
  }

  get isCollection() {
    return true
  }

  getItems() {
    return this._api.getEntitiesByType(this._getCollectionType())
  }

  addItem(item) { // eslint-disable-line no-unused-vars
    
  }

  removeItem(item) { // eslint-disable-line no-unused-vars

  }
}