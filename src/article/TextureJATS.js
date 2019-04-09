import { createSchema } from './shared/xmlSchemaHelpers'
import TextureJATSData from '../../tmp/TextureJATS.data'

// TODO: we do not need these params, because TextureJATS is only a
// restriction of JATS archiving, not a customisation.
// ATM, I also do not want to maintain a DTD.
const DOC_TYPE_PARAMS = ['article', 'TextureJATS 0.1.0', 'http://substance.io/TextureJATS-1.0.dtd']

export default createSchema(TextureJATSData, 'jats', '0.1.0', DOC_TYPE_PARAMS)
