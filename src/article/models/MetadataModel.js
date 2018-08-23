import { CompositeModel } from '../../kit'
import TranslationCollectionModel from './TranslationCollectionModel'
import FigureCollectionModel from './FigureCollectionModel'

export default class MetadataModel extends CompositeModel {
  constructor (api) {
    super(api)

    this.setProperties(
      { name: 'authors', model: api.getModelById('authors') },
      { name: 'editors', model: api.getModelById('editors') },
      { name: 'groups', model: api.getModelById('groups') },
      { name: 'organisations', model: api.getModelById('organisations') },
      { name: 'awards', model: api.getModelById('awards') },
      { name: 'references', model: api.getModelById('references') },
      { name: 'keywords', model: api.getModelById('keywords') },
      { name: 'subjects', model: api.getModelById('subjects') },
      { name: 'translations', model: new TranslationCollectionModel(api) },
      { name: 'article', model: api.getModelById('article-record') },
      { name: 'figures', model: new FigureCollectionModel(api) },
      { name: 'footnotes', model: api.getModelById('footnotes') }
    )
  }

  get type () { return 'metadata-matter' }
}
