import DefaultCollectionModel from './DefaultCollectionModel'

export default class OrganisationCollectionModel extends DefaultCollectionModel {
  
  addItem(item) {
    return this._api.addOrganisation(item)
  }

  removeItem(item) {
    return this._api.deleteOrganisation(item.id)
  }

  _getCollectionId() {
    return 'organisations'
  }

  _getCollectionType() {
    return 'organisation'
  }
}