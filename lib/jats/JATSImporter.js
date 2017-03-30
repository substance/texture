import last from 'lodash/last'
import { DefaultDOMElement, DOMImporter, XMLImporter, platform } from 'substance'
import UnsupportedNodeJATSConverter from '../unsupported/UnsupportedNodeJATSConverter'

class JATSImporter extends XMLImporter {
  constructor(config) {
    super(config)
    config.enableInlineWrapper = true
    this.state = new JATSImporter.State()
  }

  importDocument(xmlString) {
    this.reset()
    let xmlDoc = DefaultDOMElement.parseXML(xmlString, 'fullDoc')
    // HACK: server side impl gives an array
    let articleEl
    if (platform.inBrowser) {
      articleEl = xmlDoc.find('article')
    } else {
      // HACK: this should be more convenient
      for (let idx = 0; idx < xmlDoc.length; idx++) {
        if (xmlDoc[idx].tagName === 'article') {
          articleEl = xmlDoc[idx]
        }
      }
    }
    this.convertDocument(articleEl)
    let doc = this.generateDocument()
    return doc
  }

  convertDocument(articleElement) {
    this.convertElement(articleElement)
  }

  convertElements(elements, startIdx, endIdx) {
    if (arguments.length < 2) {
      startIdx = 0
    }
    if(arguments.length < 3) {
      endIdx = elements.length
    }
    let nodes = []
    for (let i = startIdx; i < endIdx; i++) {
      nodes.push(this.convertElement(elements[i]))
    }
    return nodes
  }

  _converterCanBeApplied(converter, el) {
    return converter.matchElement(el, this)
  }

  _getUnsupportedNodeConverter() {
    return UnsupportedNodeJATSConverter
  }

  _nodeData(el, schema) {
    let nodeData = super._nodeData(el, schema)
    nodeData.attributes = el.getAttributes()
    return nodeData
  }

}

class State extends DOMImporter.State {

  reset(...args) {
    super.reset(...args)
    // stack for list types
    this.lists = []
    this.listItemLevel = 1
  }

  getCurrentListItemLevel() {
    return this.listItemLevel
  }

  increaseListItemLevel() {
    return this.listItemLevel++
  }

  decreaseListItemLevel() {
    return this.listItemLevel--
  }

  getCurrentList() {
    return last(this.lists)
  }

}

JATSImporter.State = State

export default JATSImporter
