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
      node.content = importer.convertElement(contentEl).id
    }
  }

  _getContent (el) {
    return findChild(el, 'tex-math')
  }

  export (node, el, exporter) {
    let $$ = exporter.$$
    let doc = exporter.getDocument()
    // ATTENTION: this helper retrieves the label from the state
    let label = getLabel(node)
    if (label) {
      el.append($$('label').text(label))
    }
    if (node.content) {
      el.append(
        exporter.convertNode(doc.get(node.content))
      )
    }
  }
}
