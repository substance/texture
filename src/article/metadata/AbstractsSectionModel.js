/**
 * An artificial collection model which contains main abstract and custom abtracts
 */
export default class AbstractsSectionModel {
  constructor (api) {
    this._api = api
  }

  get id () {
    return '@abstracts'
  }

  get type () { return 'collection' }

  get isCollection () {
    return true
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
}
