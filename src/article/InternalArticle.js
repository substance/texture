import { XMLSchema } from 'substance'
import InternalArticleData from '../../tmp/InternalArticle.data'

const InternalArticle = XMLSchema.fromJSON(InternalArticleData)

// TODO: this should come from compilation
InternalArticle.getName = function() {
  return 'texture-article'
}

InternalArticle.getVersion = function() {
  return '0.1.0'
}

InternalArticle.getDefaultTextType = function() {
  return 'p'
}

InternalArticle.getDocTypeParams = function() {
  return ['article', 'InternalArticle 0.1.0', 'http://substance.io/InternalArticle-0.1.0.dtd']
}

InternalArticle.uri = "http://substance.io/InternalArticle-0.1.0.dtd"

export default InternalArticle
