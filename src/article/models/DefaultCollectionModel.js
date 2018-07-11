export default class DefaultCollectionModel {
  constructor(api) {
    this._api = api
  }

  get id() {
    return this._getCollectionId()
  }

  getItems() {
    return this._api.getEntitiesByType(this._getCollectionType())
  }

  addItem(item) {
    
  }

  removeItem(item) {

  }
}