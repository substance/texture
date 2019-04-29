import { DefaultDOMElement } from 'substance'

export default {
  type: 'unsupported-inline-node',
  matchElement (el) {
    return false
  },
  import (el, node) {
    node.data = el.serialize()
  },
  export (node, el) {
    return DefaultDOMElement.parseSnippet(node.data, 'xml')
  }
}
