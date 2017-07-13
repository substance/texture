import { deserializeXMLSchema } from 'substance'
import TextureJATSData from '../../tmp/TextureJATS.data'

const TextureJATS = deserializeXMLSchema(TextureJATSData)

// TODO: this should come from compilation
TextureJATS.getName = function() {
  return 'texture-jats'
}

TextureJATS.getVersion = function() {
  return '1.1'
}

TextureJATS.getStartElement = function() {
  return 'article'
}

TextureJATS.getDocTypeParams = function() {
  return ['article', 'TextureJATS 1.1', 'http://texture.substance.io/TextureJATS-1.1.dtd']
}


TextureJATS.uri = "http://texture.substance.io/jats/1.1/TextureJATS.dtd"


export default TextureJATS
