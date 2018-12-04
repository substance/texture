import FootnoteCollectionModel from './FootnoteCollectionModel'

export default class TableFootnoteCollectionModel extends FootnoteCollectionModel {
  getItems () {
    let fns = this.getFootnoteManager().getCitables()
    let result = fns.map(fn => this._api.getModelById(fn.id))
    return result
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
