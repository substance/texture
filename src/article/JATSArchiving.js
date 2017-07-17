import { XMLSchema } from 'substance'
import JATSArchivingData from '../../tmp/JATS-archiving.data'

const JATSArchiving = XMLSchema.fromJSON(JATSArchivingData)

// TODO: this should come from compilation
JATSArchiving.getName = function() {
  return 'jats'
}

JATSArchiving.getVersion = function() {
  return '1.1'
}

JATSArchiving.getDocTypeParams = function() {
  return [
    'article',
    '-//NLM//DTD JATS (Z39.96) Journal Archiving DTD v1.0 20120330//EN',
    'JATS-journalarchiving.dtd'
  ]
}


export default JATSArchiving