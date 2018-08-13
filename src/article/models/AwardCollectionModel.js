import DefaultCollectionModel from './DefaultCollectionModel'

export default class AwardCollectionModel extends DefaultCollectionModel {
  _getCollectionId () {
    return 'awards'
  }

  _getCollectionType () {
    return 'award'
  }
}
