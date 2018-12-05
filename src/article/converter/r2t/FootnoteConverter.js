import { findChild, findAllChildren } from '../util/domHelpers'

export default class FootnoteConverter {
  get type () { return 'fn' }

  get tagName () { return 'fn' }

  import (el, node, importer) {
    // TODO: at some point we want to retain the label and determine if the label should be treated as custom
    // or be generated
    let labelEl = findChild(el, 'label')
    let pEls = findAllChildren(el, 'p')

    if (labelEl) {
      node.label = labelEl.text()
    }
    node._childNodes = pEls.map(el => importer.convertElement(el).id)
  }

  export (node, el, exporter) {
    const $$ = exporter.$$
    el.append($$('label').text(node.label))
    el.append(node.getChildren().map(p => exporter.convertNode(p)))
  }
}
