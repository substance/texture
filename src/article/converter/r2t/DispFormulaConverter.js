import { DefaultDOMElement } from 'substance'
import { findChild } from '../util/domHelpers'
import { getLabel } from '../../shared/nodeHelpers'

export default class DispFormulaConverter {
  get type () { return 'disp-formula' }

  get tagName () { return 'disp-formula' }

  import (el, node, importer) {
    let labelEl = findChild(el, 'label')
    let contentEl = this._getContent(el)
    // Conversion
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
