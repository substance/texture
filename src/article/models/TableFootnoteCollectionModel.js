import DefaultCollectionModel from './DefaultCollectionModel'

export default class TableFootnoteCollectionModel extends DefaultCollectionModel {
  getItems () {
    let result = this.getFootnoteManager().getSortedCitables().map(fn => this._api.getModelById(fn.id))
    return result
  }

  addItem (item = {}) {
    return this._api._insertTableFootnote(this._prepareItem(item), this)
  }

  getFootnoteManager () {
    return this._node.getFootnoteManager()
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
