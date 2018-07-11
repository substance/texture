import DefaultCollectionModel from './DefaultCollectionModel'

export default class EditorCollectionModel extends DefaultCollectionModel {
  constructor(api, node) {
    super(api, node)
    this._node = node
  }

  getItems() {
    return this._api.getEditors()
  }

  _getCollectionId() {
    return 'editors'
  }

  _getCollectionType() {
    return 'editor'
  }
}