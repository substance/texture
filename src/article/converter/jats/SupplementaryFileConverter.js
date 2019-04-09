import { findChild, retainChildren } from '../util/domHelpers'
import { getLabel } from '../../shared/nodeHelpers'

export default class SupplementaryFileConverter {
  get type () { return 'supplementary-file' }

  get tagName () { return 'supplementary-material' }

  import (el, node, importer) {
    let $$ = el.createElement.bind(el.getOwnerDocument())
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
    // TODO: we need contextual RNG restriction for captions
    // otherwise we do not know the exact content of a caption
    retainChildren(captionEl, 'p')
    if (captionEl.getChildCount() === 0) {
      captionEl.append($$('p'))
    }
    if (labelEl) {
      node.label = labelEl.text()
    }
    node.href = el.getAttribute('xlink:href')
    node.remote = _isRemoteFile(node.href)
    let mimetype = el.getAttribute('mimetype')
    let mimeSubtype = el.getAttribute('mime-subtype')
    if (mimetype || mimeSubtype) {
      node.mimetype = [mimetype, mimeSubtype].filter(Boolean).join('/')
    }
    node.legend = captionEl.children.map(child => importer.convertElement(child).id)
  }

  export (node, el, exporter) {
    let $$ = exporter.$$
    if (node.mimetype) {
      let mimeData = node.mimetype.split('/')
      if (mimeData[0]) {
        el.attr({
          'mimetype': mimeData[0]
        })
      }
      if (mimeData[1]) {
        el.attr({
          'mime-subtype': mimeData[1]
        })
      }
    }
    el.attr({
      'xlink:href': node.href
    })
    let label = getLabel(node)
    if (label) {
      el.append($$('label').text(label))
    }
    if (node.legend && node.legend.length > 0) {
      el.append(
        $$('caption').append(
          node.resolve('legend').map(p => {
            return exporter.convertNode(p)
          })
        )
      )
    }
  }
}

function _isRemoteFile (href) {
  return Boolean(/^\w+:\/\//.exec(href))
}
