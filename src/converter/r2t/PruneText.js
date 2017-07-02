import { TextureJATS } from '../../article'

/*
  Removes all native TextNodes from elements which we specified to be
  not-mixed.
*/
export default class PruneText {

  import(dom) {
    _prune(dom.find('article'))
  }

  export() {
    // nothing
  }
}

const PRESERVE_WHITESPACE = {
  'preformat': true,
  'code': true
}

function _prune(el) {
  if (el.isElementNode()) {
    let schema = TextureJATS.getElementSchema(el.tagName)
    if (!schema.isTextAllowed()) {
      _pruneText(el)
    } else if (!PRESERVE_WHITESPACE[el.tagName]) {
      // TODO replace duplicate whitespace
      // i.e. replace /\s\s+/ with ' '
    }
  }
}

function _pruneText(el) {
  let childNodes = el.childNodes
  for (let i = childNodes.length - 1; i >= 0; i--) {
    let child = childNodes[i]
    if (child.isTextNode()) {
      el.removeChild(child)
    } else if (child.isElementNode()) {
      _prune(child)
    }
  }
}