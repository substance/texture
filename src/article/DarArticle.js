import { XMLSchema } from 'substance'
import DarArticleData from '../../tmp/DarArticle.data'

const DarArticle = XMLSchema.fromJSON(DarArticleData)


// TODO: this should come from compilation
DarArticle.getName = function() {
  return 'DarArticle'
}

DarArticle.getVersion = function() {
  return '1.1'
}

DarArticle.getDocTypeParams = function() {
  return ['article', 'DarArticle 1.1', 'http://texture.substance.io/DarArticle-1.1.dtd']
}

export default DarArticle
