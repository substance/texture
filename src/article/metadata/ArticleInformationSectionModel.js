export default class ArticleInformationSectionModel {
  constructor (api) {
    this._api = api
    const doc = api.getDocument()
    this.cards = [
      { name: 'article-metadata', model: { id: 'article-metadata', node: doc.get('metadata') } }
    ]
  }

  get id () {
    return 'article-information'
  }
}
