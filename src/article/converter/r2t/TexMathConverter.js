import { DefaultDOMElement } from 'substance'

// TODO: instead of having a TexMathConverter we should implement a FormulaConverter
// which is doing this. The reason is, that TexMath is not a 'concept' in our internal model, it
// is rather related to JATS
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
