import { findChild, findAllChildren } from '../util/domHelpers'

export default class DispQuoteConverter {
  get type () { return 'disp-quote' }

  get tagName () { return 'disp-quote' }

  import (el, node, importer) {
    let pEls = findAllChildren(el, 'p')
    let attrib = findChild(el, 'attrib')
    if (attrib) {
      node.attrib = importer.annotatedText(attrib, [node.id, 'attrib'])
    }
    node._childNodes = pEls.map(p => {
      return importer.convertElement(p).id
    })
  }

  export (node, el, exporter) {
    let $$ = exporter.$$
    let children = node.getChildren()
    el.append(
      children.map(child => {
        exporter.convertNode(child)
      })
    )
    if (node.attrib) {
      el.append(
        $$('attrib').append(
          exporter.annotatedText([node.id, 'attrib'])
        )
      )
    }
  }
}
