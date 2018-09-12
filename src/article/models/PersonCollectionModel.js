import DefaultMovableCollectionModel from './DefaultMovableCollectionModel'

export default class PersonCollectionModel extends DefaultMovableCollectionModel {
  _getItemType () {
    return 'person'
  }

  addItem (item = {}) {
    return this._api._insertPerson(this._prepareItem(item), this)
  }

  get isRemovable () {
    return true
  }
}
