import { XMLSchema } from 'substance'
import InternalArticleData from '../../tmp/InternalArticle.data'

const InternalArticleSchema = XMLSchema.fromJSON(InternalArticleData)

// TODO: this should come from compilation
InternalArticleSchema.getName = function() {
  return 'texture-article'
}

InternalArticleSchema.getVersion = function() {
  return '0.1.0'
}

InternalArticleSchema.getDefaultTextType = function() {
  return 'p'
}

InternalArticleSchema.getDocTypeParams = function() {
  return ['article', 'InternalArticle 0.1.0', 'http://substance.io/InternalArticle-0.1.0.dtd']
}

InternalArticleSchema.uri = "http://substance.io/InternalArticle-0.1.0.dtd"

export default InternalArticleSchema
