import { deserializeXMLSchema } from 'texture-xml-utils'
import TextureJATSData from '../../tmp/TextureJATS.data'
import { TEXTURE_JATS_DTD, TEXTURE_JATS_PUBLIC_ID } from './ArticleConstants'

let TextureJATS = deserializeXMLSchema(TextureJATSData,
  TEXTURE_JATS_PUBLIC_ID,
  TEXTURE_JATS_DTD
)

export default TextureJATS
