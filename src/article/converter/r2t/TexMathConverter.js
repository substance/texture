import { DefaultDOMElement } from 'substance'

export default class TexMathConverter {
  get type () { return 'tex-math' }

  get tagName () { return 'tex-math' }

  import (el, node) {
    delete node.attributes.id
    node.content = DefaultDOMElement.parseSnippet(el.getInnerXML(), 'xml').getTextContent()
  }

  export (node, el) {
    el.removeAttribute('id').append(node.content)
    return el
  }
}
