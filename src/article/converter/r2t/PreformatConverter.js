import { DefaultDOMElement } from 'substance'

export default class PreformatConverter {
  get type () { return 'preformat' }

  get tagName () { return 'preformat' }

  import (el, node, importer) {
    const content = el.getInnerXML()
    node.preformatType = el.getAttribute('preformat-type') || 'code'
    let parsedContent = DefaultDOMElement.parseSnippet(content, 'xml')
    // In case of CDATA we will have an array of two elements
    if (parsedContent.constructor === Array) parsedContent = parsedContent[0]
    node.content = parsedContent.getTextContent() || ''
  }

  export (node, el, exporter) {
    if (node.preformatType) {
      el.setAttribute('preformat-type', node.preformatType)
    }

    if (node.content) {
      el.append(el.createCDATASection(node.content))
    }
  }
}
