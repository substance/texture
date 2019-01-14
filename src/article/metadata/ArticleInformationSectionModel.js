import { createValueModel } from '../../kit'

export default class ArticleInformationSectionModel {
  constructor (api) {
    this._api = api
    const doc = api.getDocument()
    this.cards = [
      { name: 'title', model: createValueModel(api, ['article', 'title']) },
      { name: 'subtitle', model: createValueModel(api, ['article', 'subTitle']) },
      { name: 'abstract', model: createValueModel(api, ['article', 'abstract']) },
      { name: 'article-metadata', model: { id: 'article-metadata', node: doc.get('metadata') } }
    ]
  }

  get id () {
    return 'article-information'
  }
}
