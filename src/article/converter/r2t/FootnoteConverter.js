import { findChild, findAllChildren } from '../util/domHelpers'
import { getLabel } from '../../shared/nodeHelpers'

// TODO: at some point we want to retain the label and determine if the label should be treated as custom
// or be generated.
export default class FootnoteConverter {
  get type () { return 'footnote' }

  get tagName () { return 'fn' }

  import (el, node, importer) {
    let labelEl = findChild(el, 'label')
    let pEls = findAllChildren(el, 'p')
    if (labelEl) {
      node.label = labelEl.text()
    }
    node.content = pEls.map(el => importer.convertElement(el).id)
  }

  export (node, el, exporter) {
    const $$ = exporter.$$
    // We gonna need to find another way for node states. I.e. for labels we will have
    // a hybrid scenario where the labels are either edited manually, and thus we need to record ops,
    // or they are generated without persisting operations (e.g. think about undo/redo, or collab)
    // my suggestion would be to introduce volatile ops, they would be excluded from the DocumentChange, that is stored in the change history,
    // or used for collaborative editing.
    let label = getLabel(node)
    if (label) {
      el.append(
        $$('label').text(label)
      )
    }
    el.append(
      node.resolve('content').map(p => exporter.convertNode(p))
    )
  }
}
