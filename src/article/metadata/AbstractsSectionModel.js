/**
 * An artificial collection model which contains main abstract and custom abtracts
 */
export default class AbstractsSectionModel {
  constructor (api) {
    this._api = api
    this._path = ['article', 'customAbstracts']
  }

  get id () {
    return '@abstracts'
  }

  get type () { return 'collection' }

  get isCollection () {
    return true
  }

  get isValue () {
    return true
  }

  getPath () {
    return this._path
  }

  getItems () {
    let doc = this._api.getDocument()
    return [doc.get('abstract')].concat(
      doc.resolve(['article', 'customAbstracts'])
    )
  }

  get length () {
    return this.getItems().length
  }

  get _isValue () { return true }
}
