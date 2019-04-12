import { XMLSchema } from 'substance'
import TextureJATSData from '../../tmp/TextureJATS.data'

// TODO: it would be great to achieve this via an extension of the JATS schema
// i.e. instead of compiling a full schema, just compile an increment
let TextureJATS = XMLSchema.fromJSON(TextureJATSData, 'article', 'TextureArticle 1.0', '')

export default TextureJATS
