import { STRING } from 'substance'
import Annotation from './Annotation'

export default class ExternalLink extends Annotation {
  shouldNotSplit () { return true }
}

ExternalLink.schema = {
  type: 'external-link',
  href: STRING,
  linkType: STRING
}
