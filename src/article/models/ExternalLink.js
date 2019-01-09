import { STRING } from 'substance'
import Annotation from './Annotation'

export default class ExternalLink extends Annotation {}
ExternalLink.schema = {
  type: 'external-link',
  href: STRING
  // TODO: JATS also has ext-link-type
}
