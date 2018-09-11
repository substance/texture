import DefaultCollectionModel from './DefaultCollectionModel'

export default class PersonCollectionModel extends DefaultCollectionModel {
  _getItemType () {
    return 'person'
  }

  addItem (item = {}) {
    return this._api._insertPerson(this._prepareItem(item), this)
  }
}
