import DefaultCollectionModel from './DefaultCollectionModel'

export default class OrganisationCollectionModel extends DefaultCollectionModel {
  _getItemType () {
    return 'organisation'
  }
}
