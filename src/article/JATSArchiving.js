import { XMLSchema } from 'substance'
import JATSArchivingData from '../../tmp/JATS-archiving.data'

let JATSArchiving = XMLSchema.fromJSON(JATSArchivingData,
  'article',
  '-//NLM//DTD JATS (Z39.96) Journal Archiving DTD v1.0 20120330//EN',
  'JATS-journalarchiving.dtd'
)

export default JATSArchiving
