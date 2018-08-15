import { CompositeModel } from '../../kit'

export default class MetadataModel extends CompositeModel {
  constructor (api) {
    super(api)

    this.setProperties(
      { name: 'article', model: api._getModelById('article-record') },
      { name: 'authors', model: api.getCollectionForType('author') },
      { name: 'translations', model: api.getCollectionForType('translatable') },
      { name: 'editors', model: api.getCollectionForType('editor') },
      { name: 'groups', model: api.getCollectionForType('group') },
      { name: 'organisations', model: api.getCollectionForType('organisation') },
      { name: 'awards', model: api.getCollectionForType('award') },
      { name: 'figures', model: api.getCollectionForType('figure') },
      { name: 'footnotes', model: api.getCollectionForType('footnote') },
      { name: 'references', model: api.getCollectionForType('reference') },
      { name: 'keywords', model: api.getCollectionForType('keyword') },
      { name: 'subjects', model: api.getCollectionForType('subject') }
    )
  }

  get type () { return 'metadata-matter' }
}
