import { createSchema } from './shared/xmlSchemaHelpers'
import JATSArchivingData from '../../tmp/JATS-archiving.data'

const DOC_TYPE_PARAMS = [
  'article',
  '-//NLM//DTD JATS (Z39.96) Journal Archiving DTD v1.0 20120330//EN',
  'JATS-journalarchiving.dtd'
]

export default createSchema(JATSArchivingData, 'jats', '1.1', DOC_TYPE_PARAMS)
