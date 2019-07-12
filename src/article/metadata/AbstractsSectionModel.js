/**
 * This is an artificial model that takes all sorts of abstracts from the document model
 * so that they can be represented as individual cards
 */
export default class AbstractsSectionModel {
  constructor (api) {
    this._api = api
    this._path = ['article', 'customAbstracts']
  }

  get id () {
    return '@abstracts'
  }

  get type () {
    return '@abstracts'
  }

  get isCollection () {
    return true
  }

  getPath () {
    return this._path
  }

  getItems () {
    let doc = this._api.getDocument()
    return doc.resolve(['article', 'customAbstracts'])
  }

  get length () {
    return this.getItems().length
  }
}
