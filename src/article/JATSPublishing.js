import { createSchema } from './shared/xmlSchemaHelpers'
import JATSPublishingData from '../../tmp/JATS-publishing.data'

const DOC_TYPE_PARAMS = [
  'article',
  '-//NLM//DTD JATS (Z39.96) Journal Publishing DTD v1.1d1 20130915//EN',
  'JATS-journalpublishing1.dtd'
]

export default createSchema(JATSPublishingData, 'jats', '1.1', DOC_TYPE_PARAMS)
