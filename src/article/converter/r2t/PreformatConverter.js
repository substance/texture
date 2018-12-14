import { DefaultDOMElement, isArray } from 'substance'

export default class PreformatConverter {
  get type () { return 'preformat' }

  get tagName () { return 'preformat' }

  import (el, node, importer) {
    let xml = el.getInnerXML()
    node.preformatType = el.getAttribute('preformat-type') || 'code'
    // ATTENTION: trimming the content to avoid extra TEXTNODES
    xml = xml.trim()
    let els = DefaultDOMElement.parseSnippet(xml, 'xml')
    // NOTE: trying to find the math source robustly
    // often the content is wrapped with CDATA but is also allowed without
    let content
    if (isArray(els)) {
      content = els.map(el => el.getTextContent()).join('')
    } else {
      content = els.getTextContent()
    }
    node.content = content || ''
  }

  export (node, el, exporter) {
    if (node.preformatType) {
      el.setAttribute('preformat-type', node.preformatType)
    }

    if (node.content) {
      // ATTENTION: on export we always create CDATA for sake of simplicity
      // otherwise we woul need to detect if the content contained certain characters (such as '<>')
      el.append(el.createCDATASection(node.content))
    }
  }
}
