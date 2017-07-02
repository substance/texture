import { TextureJATS } from '../../article'

/*
  Removes all native TextNodes from elements which we specified to be
  not-mixed.
*/
export default class PruneText {

  import(dom, converter) {
    _prune(dom.find('article'))
  }

  export(dom) {
    // nothing
  }
}

function _prune(el) {
  if (el.isElementNode()) {
    let schema = TextureJATS.getElementSchema(el.tagName)
    if (!schema.isTextAllowed()) {
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
  }
}