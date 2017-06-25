import { deserializeXMLSchema } from 'substance'
import JATSData from '../../tmp/JATS.data'

const JATS = deserializeXMLSchema(JATSData)

// TODO: this should come from compilation
JATS.getName = function() {
  return 'JATS'
}

JATS.getVersion = function() {
  return '1.1'
}

JATS.getStartElement = function() {
  return 'article'
}


export default JATS