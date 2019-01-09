import { DefaultDOMElement } from 'substance'
import { findChild } from '../util/domHelpers'
import { getLabel } from '../../shared/nodeHelpers'

// ATTENTION: ATM we only allow content-type 'math/tex'
export default class BlockFormulaConverter {
  get type () { return 'block-formula' }

  get tagName () { return 'disp-formula' }

  import (el, node, importer) {
    let labelEl = findChild(el, 'label')
    let contentType = el.attr('content-type')
    if (contentType && contentType !== 'math/tex') {
      throw new Error('Only content-type="math/tex" is supported.')
    }
    let contentEl = this._getContent(el)
    if (labelEl) {
      node.label = labelEl.text()
    }
    if (contentEl) {
      node.content = DefaultDOMElement.parseSnippet(contentEl.getInnerXML(), 'xml').getTextContent()
    }
  }

  _getContent (el) {
    return findChild(el, 'tex-math')
  }

  export (node, el, exporter) {
    let $$ = exporter.$$

    // Note: ATM only math/tex is supported and thus hard-coded here
    el.attr('content-type', 'math/tex')

    let label = getLabel(node)
    if (label) {
      el.append($$('label').text(label))
    }
    if (node.content) {
      const texMath = $$('tex-math')
      texMath.append(texMath.createCDATASection(node.content))
      el.append(
        texMath
      )
    }
  }
}
