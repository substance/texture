import { CompositeModel } from '../../kit'

export default class FrontMatterModel extends CompositeModel {
  constructor (api) {
    super(api)

    this.setProperties(
      { name: 'title', model: api.getArticleTitle() },
      { name: 'authors', model: api.getAuthorsModel() },
      { name: 'abstract', model: api.getArticleAbstract() }
    )
  }

  get type () { return 'front-matter' }
}
