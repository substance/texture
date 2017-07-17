import { XMLSchema } from 'substance'
import JATSData from '../../tmp/JATS-archiving.data'
// import JATSData from '../../tmp/JATS-publishing.data'

const JATS = XMLSchema.fromJSON(JATSData)

// TODO: this should come from compilation
JATS.getName = function() {
  return 'jats'
}

JATS.getVersion = function() {
  return '1.1'
}

// TODO: make sure these are correct
JATS.getDocTypeParams = function() {
  return [
    'article',
    '-//NLM//DTD JATS (Z39.96) Journal Archiving DTD v1.0 20120330//EN',
    'JATS-journalarchiving.dtd'
  ]
}

// JATS.getDocTypeParams = function() {
//   return [
//     'article',
//     '-//NLM//DTD JATS (Z39.96) Journal Publishing DTD v1.0 20120330//EN',
//     'JATS-journalpublishing1.dtd'
//   ]
// }

export default JATS
