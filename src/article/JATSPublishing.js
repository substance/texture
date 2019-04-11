import { XMLSchema } from 'substance'
import JATSPublishingData from '../../tmp/JATS-publishing.data'

let JATSPublishing = XMLSchema.fromJSON(JATSPublishingData,
  'article',
  '-//NLM//DTD JATS (Z39.96) Journal Publishing DTD v1.1d1 20130915//EN',
  'JATS-journalpublishing1.dtd')

export default JATSPublishing
