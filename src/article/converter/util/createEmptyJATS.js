import { DefaultDOMElement } from 'substance'
import { EMPTY_JATS } from '../../ArticleConstants'

export default function createEmptyJATS () {
  return DefaultDOMElement.parseXML(EMPTY_JATS)
}
