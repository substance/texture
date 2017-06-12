import { deserializeXMLSchema } from 'substance'
import TextureJATSData from '../../tmp/TextureJATS.data'

const TextureJATS = deserializeXMLSchema(TextureJATSData)

export default TextureJATS