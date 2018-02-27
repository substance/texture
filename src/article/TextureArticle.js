import { XMLSchema } from 'substance'
import TextureArticleData from '../../tmp/TextureArticle.data'

const TextureArticle = XMLSchema.fromJSON(TextureArticleData)

// TODO: this should come from compilation
TextureArticle.getName = function() {
  return 'texture-article'
}

TextureArticle.getVersion = function() {
  return '1.1'
}

TextureArticle.getDefaultTextType = function() {
  return 'p'
}

TextureArticle.getDocTypeParams = function() {
  return ['article', 'TextureArticle 1.1', 'http://texture.substance.io/TextureArticle-1.1.dtd']
}


TextureArticle.uri = "http://texture.substance.io/jats/1.1/TextureArticle.dtd"


export default TextureArticle
