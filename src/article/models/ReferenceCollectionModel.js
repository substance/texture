
export default class ReferenceCollectionModel {
  constructor(api) {
    this._api = api
  }

  get id() {
    return 'references'
  }

  get isCollection() {
    return true
  }

  getItems() {
    let refNodes = this._api.getReferenceManager().getBibliography()
    let result = refNodes.map(refNode => this._getItem(refNode.id ))
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
    let doc = this._api.getArticle()
    let article = this._api.getArticle()

    let ref = doc.get(id)
    if (!ref) {
      console.warn(`Reference ${id} not found.`)
      return undefined
    }
    let entityId = ref.attr('rid')
    let entity = article.get(entityId)
    if (!entity) {
      console.warn(`No db entry found for ${entityId}.`)
      return undefined
    }

    let model = this._api.getModel(entity.type, entity)
    return model
  }

}