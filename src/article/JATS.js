import { deserializeXMLSchema } from 'substance'
import JATSData from '../../tmp/JATS-publishing.data'

const JATS = deserializeXMLSchema(JATSData)

// TODO: this should come from compilation
JATS.getName = function() {
  return 'jats'
}

JATS.getVersion = function() {
  return '1.1'
}

JATS.getStartElement = function() {
  return 'article'
}

JATS.getDocTypeParams = function() {
  return [
    'article',
    '-//NLM//DTD JATS (Z39.96) Journal Publishing DTD v1.0 20120330//EN',
    'JATS-journalpublishing1.dtd'
  ]
}


export default JATS
