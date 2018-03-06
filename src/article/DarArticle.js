import { XMLSchema } from 'substance'
import DarArticleData from '../../tmp/DarArticle.data'

const DarArticle = XMLSchema.fromJSON(DarArticleData)


// TODO: this should come from compilation
DarArticle.getName = function() {
  return 'dar-article'
}

DarArticle.getVersion = function() {
  return '0.1.0'
}

DarArticle.getDocTypeParams = function() {
  return ['article', 'DarArticle 0.1.0', 'http://darformat.org/DarArticle-0.1.0.dtd']
}

export default DarArticle
