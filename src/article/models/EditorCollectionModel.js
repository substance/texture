import DefaultCollectionModel from './DefaultCollectionModel'

export default class EditorCollectionModel extends DefaultCollectionModel {
  constructor(api, node) {
    super(api, node)
    this._node = node
  }

  addItem(item) {
    return this._api.addPerson(item, 'editor')
  }
  
  removeItem(item) {
    return this._api.deletePerson(item.id, 'editor')
  }

  getItems() {
    return this._api.getPersons('editor')
  }

  _getCollectionId() {
    return 'editors'
  }

  _getCollectionType() {
    return 'editor'
  }
}