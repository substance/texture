import { findChild, findAllChildren } from '../util/domHelpers'

/**
 * A converter for JATS `<disp-quote>`.
 * Our internal model deviates from the original one in that the the attribution is separated from
 * the quote content by using a dedicated text property 'attrib'
 */
export default class BlockQuoteConverter {
  get type () { return 'block-quote' }

  get tagName () { return 'disp-quote' }

  import (el, node, importer) {
    let $$ = el.createElement.bind(el.getOwnerDocument())
    let pEls = findAllChildren(el, 'p')
    if (pEls.length === 0) {
      pEls.push($$('p'))
    }
    let attrib = findChild(el, 'attrib')
    if (attrib) {
      node.attrib = importer.annotatedText(attrib, [node.id, 'attrib'])
    }
    node.content = pEls.map(p => {
      return importer.convertElement(p).id
    })
  }

  export (node, el, exporter) {
    let $$ = exporter.$$
    let content = node.resolve('content')
    el.append(
      content.map(p => {
        return exporter.convertNode(p)
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
