
export default class ReferenceCollectionModel {
  constructor (api) {
    this._api = api
  }

  get type () { return 'references' }

  get id () {
    return 'references'
  }

  get isCollection () {
    return true
  }

  getItems () {
    let refs = this._api.getReferenceManager().getBibliography()
    let result = refs.map(ref => this._getItem(ref.id))
    return result
  }

  addItem (item) {
    this._api._addModel(item)
  }

  addItems (items) {
    this._api.addReferences(items)
  }

  removeItem (item) {
    this._api._removeModel(item)
  }

  _getItem (id) {
    let article = this._api.getArticle()
    let node = article.get(id)
    if (!node) {
      console.warn(`No db entry found for ${id}.`)
      return undefined
    }

    let model = this._api._getModelForNode(node)
    return model
  }
}
