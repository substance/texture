import { XMLSchema } from 'substance'
import JATSPublishingData from '../../tmp/JATS-publishing.data'

const JATSPublishing = XMLSchema.fromJSON(JATSPublishingData)

// TODO: this should come from compilation
JATSPublishing.getName = function() {
  return 'jats'
}

JATSPublishing.getVersion = function() {
  return '1.1'
}

JATSPublishing.getDocTypeParams = function() {
  return [
    'article',
    '-//NLM//DTD JATS (Z39.96) Journal Publishing DTD v1.0 20120330//EN',
    'JATS-journalpublishing1.dtd'
  ]
}


export default JATSPublishing