import DefaultCollectionModel from './DefaultCollectionModel'

export default class FootnoteCollectionModel extends DefaultCollectionModel {
  // Note: this is special because it provides a sorted list of footnotes
  getItems () {
    let fns = this._api.getFootnoteManager().getSortedCitables()
    let result = fns.map(fn => this._api.getModelById(fn.id))
    return result
  }

  addItem (item = {}) {
    return this._api._insertFootnote(this._prepareItem(item), this)
  }

  get isRemovable () {
    return true
  }

  _getItemType () {
    return 'fn'
  }
}
