import DefaultCollectionModel from './DefaultCollectionModel'

export default class FootnoteCollectionModel extends DefaultCollectionModel {
  addItem (item = {}) {
    return this._api._insertFootnote(this._prepareItem(item), this)
  }

  _getItemType () {
    return 'fn'
  }
}
