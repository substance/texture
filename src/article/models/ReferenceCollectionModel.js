
export default class ReferenceCollectionModel {
  constructor(api) {
    this._api = api
  }

  get type () { return 'references' }

  get id() {
    return 'references'
  }

  get isCollection() {
    return true
  }

  getItems() {
    let refs = this._api.getReferenceManager().getBibliography()
    let result = refs.map(ref => this._getItem(ref.id))
    return result
  }

  addItem(item) {
    this._api.addReference(item, item.type)
  }

  addItems(items) {
    this._api.addReferences(items)
  }

  removeItem(item) {
    this._api.deleteReference(item.id)
  }

  _getItem(id) {
    let article = this._api.getArticle()
    let entity = article.get(id)
    if (!entity) {
      console.warn(`No db entry found for ${id}.`)
      return undefined
    }

    let model = this._api.getModel(entity.type, entity)
    return model
  }

}