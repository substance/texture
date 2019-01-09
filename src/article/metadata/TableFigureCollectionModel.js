/**
 * An artificial collection model, that is generated from the article body
 */
export default class TableFigureCollectionModel {
  constructor (api) {
    this._api = api
  }

  get id () { return '@tables' }

  get type () { return 'collection' }

  get isCollection () {
    return true
  }

  getItems () {
    let doc = this._api.getDocument()
    return doc.get('body').findAll('table-figure')
  }
}
