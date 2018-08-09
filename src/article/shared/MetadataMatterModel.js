import { CompositeModel } from '../../kit'
import ReferenceCollectionModel from '../models/ReferenceCollectionModel'

export default class MetadataMatterModel extends CompositeModel {
  constructor (api) {
    super(api)

    this.setProperties(
      { name: 'article', model: api._getModelById('article-record') },
      { name: 'authors', model: api.getCollectionForType('authors') },
      { name: 'translations', model: api.getCollectionForType('translatables') },
      { name: 'editors', model: api.getCollectionForType('editors') },
      { name: 'groups', model: api.getCollectionForType('groups') },
      { name: 'organisations', model: api.getCollectionForType('organisations') },
      { name: 'awards', model: api.getCollectionForType('awards') },
      { name: 'figures', model: api.getCollectionForType('figures') },
      { name: 'footnotes', model: api.getCollectionForType('footnotes') },
      { name: 'references', model: new ReferenceCollectionModel(api) },
      { name: 'keywords', model: api.getCollectionForType('keywords') },
      { name: 'subjects', model: api.getCollectionForType('subjects') }
    )
  }

  get type () { return 'metadata-matter' }
}
