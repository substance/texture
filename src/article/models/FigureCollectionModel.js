export default class FigureCollectionModel {
  constructor (api) {
    this._api = api
  }

  get id () {
    return 'figures'
  }

  get type () {
    return 'figures'
  }

  get isCollection () {
    return true
  }

  getItems () {
    const api = this._api
    let article = api.getArticle()
    let figureNodes = article.get('body').findAll('figure')
    return figureNodes.map(node => api.getModelById(node.id))
  }
}
