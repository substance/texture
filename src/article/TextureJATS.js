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

export default TextureJATS