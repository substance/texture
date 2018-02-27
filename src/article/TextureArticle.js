import { XMLSchema } from 'substance'
import TextureArticleData from '../../tmp/TextureArticle.data'

const TextureArticle = XMLSchema.fromJSON(TextureArticleData)

// TODO: this should come from compilation
TextureArticle.getName = function() {
  return 'texture-article'
}

TextureArticle.getVersion = function() {
  return '0.1.0'
}

TextureArticle.getDefaultTextType = function() {
  return 'p'
}

TextureArticle.getDocTypeParams = function() {
  return ['article', 'TextureArticle 0.1.0', 'http://substance.io/TextureArticle-0.1.0.dtd']
}

TextureArticle.uri = "http://substance.io/TextureArticle-0.1.0.dtd"


export default TextureArticle
