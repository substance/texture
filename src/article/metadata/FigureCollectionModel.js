/**
 * An artificial collection model, that is generated from the article body
 */
export default class FigureCollectionModel {
  constructor (api) {
    this._api = api
  }

  get id () {
    return '@figures'
  }

  get type () {
    return '@figures'
  }

  get isCollection () {
    return true
  }

  getItems () {
    let doc = this._api.getDocument()
    return doc.get('body').findAll('figure')
  }
}
