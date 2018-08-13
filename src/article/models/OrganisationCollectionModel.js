import DefaultCollectionModel from './DefaultCollectionModel'

export default class OrganisationCollectionModel extends DefaultCollectionModel {
  _getCollectionId () {
    return 'organisations'
  }

  _getCollectionType () {
    return 'organisation'
  }
}
