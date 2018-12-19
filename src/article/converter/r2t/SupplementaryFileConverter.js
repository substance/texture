import { findChild } from '../util/domHelpers'
import { getLabel } from '../../shared/nodeHelpers'

export default class SupplementaryFileConverter {
  get type () { return 'supplementary-file' }

  get tagName () { return 'supplementary-material' }

  import (el, node, importer) {
    let $$ = importer.$$
    let labelEl = findChild(el, 'label')
    let captionEl = findChild(el, 'caption')
    // create a new caption element
    if (!captionEl) {
      captionEl = $$('caption')
    }
    // there must be at least one paragraph
    if (!captionEl.find('p')) {
      captionEl.append($$('p'))
    }
    // drop everything than 'p' from caption
    // TODO: use the node schema to decide which
    // elements to drop
    let captionContent = captionEl.children
    for (let idx = captionContent.length - 1; idx >= 0; idx--) {
      let child = captionContent[idx]
      if (child.tagName !== 'p') {
        captionEl.removeAt(idx)
      }
    }
    if (labelEl) {
      node.label = labelEl.text()
    }
    node.href = el.getAttribute('xlink:href')
    node.legend = importer.convertElement(captionEl).id
  }

  export (node, el, exporter) {
    let $$ = exporter.$$
    let doc = node.getDocument()
    el.attr('xlink:href', node.href)
    let label = getLabel(node)
    if (label) {
      el.append($$('label').text(label))
    }
    if (node.legend && node.legend.length > 0) {
      el.append(
        exporter.convertNode(doc.get(node.legend))
      )
    }
  }
}
