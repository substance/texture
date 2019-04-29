import { STRING, Fragmenter } from 'substance'
import Annotation from './Annotation'

export default class ExternalLink extends Annotation {
  static get fragmentation () { return Fragmenter.SHOULD_NOT_SPLIT }
}
ExternalLink.schema = {
  type: 'external-link',
  href: STRING,
  linkType: STRING
}
