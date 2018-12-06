import DefaultCollectionModel from './DefaultCollectionModel'

export default class TableFootnoteCollectionModel extends DefaultCollectionModel {
  getItems () {
    let result = this._node.footnotes.map(id => this._api.getModelById(id))
    return result
  }

  addItem (item = {}) {
    return this._api._insertTableFootnote(this._prepareItem(item), this)
  }

  getFootnoteManager () {
    return this._node._tableFootnoteManager
  }

  get length () {
    return this._node.footnotes.length
  }

  get isRemovable () {
    return true
  }

  _getItemType () {
    return 'fn'
  }
}
