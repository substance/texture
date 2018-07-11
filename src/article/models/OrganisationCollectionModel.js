import DefaultCollectionModel from './DefaultCollectionModel'

export default class OrganisationCollectionModel extends DefaultCollectionModel {

  _getCollectionId() {
    return 'organisations'
  }

  _getCollectionType() {
    return 'organisation'
  }

  addItem() {
    // TODO: we need some XML manipulation here, until we have changed the internal model to not use XML anymore
  }
}