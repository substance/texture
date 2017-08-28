import { importContentLoc, exportContentLoc } from './contentLocHelpers'
import { findChild } from '../util/domHelpers'

export default class ConvertElementCitation {

  import(dom) {
    let elementCitations = dom.findAll('element-citation')
    elementCitations.forEach((elementCitation) => {
      importContentLoc(elementCitation)
      _createEmptyElementsIfNotExist(elementCitation)
    })
  }

  export(dom) {
    let elementCitations = dom.findAll('element-citation')
    elementCitations.forEach((elementCitation) => {
      exportContentLoc(elementCitation)
      _stripEmptyElements(elementCitation)
    })
  }
}

// Elements that must be present in TextureJATS <element-citation>
const REQUIRED_ELEMENTS = [
  'article-title',
  'chapter-title',
  'edition',
  'issue',
  'source',
  'volume',
  'year',
  'publisher-loc',
  'publisher-name'
]

ConvertElementCitation.REQUIRED_ELEMENTS = REQUIRED_ELEMENTS

function _createEmptyElementsIfNotExist(el) {
  REQUIRED_ELEMENTS.forEach((tagName) => {
    let childEl = findChild(el, tagName)
    if (!childEl) {
      el.append(
        el.createElement(tagName).append('')
      )
    }
  })
}

function _stripEmptyElements(el) {
  REQUIRED_ELEMENTS.forEach((tagName) => {
    let childEl = findChild(el, tagName)
    if (childEl.textContent === '') {
      el.removeChild(childEl)
    }
  })
}
