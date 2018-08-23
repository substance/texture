import DefaultCollectionModel from './DefaultCollectionModel'

export default class PersonCollectionModel extends DefaultCollectionModel {
  _getItemType () {
    return 'person'
  }
}
