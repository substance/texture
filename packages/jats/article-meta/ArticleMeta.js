import DocumentNode from 'substance/model/DocumentNode'

class ArticleMeta extends DocumentNode {}

ArticleMeta.static.name = 'article-meta'

ArticleMeta.static.defineSchema({
  attributes: { type: 'object', default: {} },
  nodes: { type: ['id'], default: [] }
})

export default ArticleMeta
