export default class ContentNodeCollectionModel {
  constructor (api) {
    this._api = api
  }

  get isCollection () {
    return true
  }

  getItems () {
    const api = this._api
    let article = api.getArticle()
    let nodes = article.get('body').findAll(this._getSelector())
    return nodes.map(node => api.getModelById(node.id))
  }

  _getSelector () {
    throw new Error('This method is abstract.')
  }
}
