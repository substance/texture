import last from 'lodash/last'
import DOMImporter from 'substance/model/DOMImporter'
import XMLImporter from 'substance/model/XMLImporter'
import DefaultDOMElement from 'substance/ui/DefaultDOMElement'
import UnsupportedNodeJATSConverter from '../unsupported/UnsupportedNodeJATSConverter'
import inBrowser from 'substance/util/inBrowser'

class JATSImporter extends XMLImporter {

  constructor(config) {
    config.enableInlineWrapper = true
    super(config)
    this.state = new JATSImporter.State()
  }

  importDocument(xmlString) {
    this.reset()
    var xmlDoc = DefaultDOMElement.parseXML(xmlString, 'fullDoc')
    // HACK: server side impl gives an array
    var articleEl
    if (inBrowser) {
      articleEl = xmlDoc.find('article')
    } else {
      // HACK: this should be more convenient
      for (var idx = 0; idx < xmlDoc.length; idx++) {
        if (xmlDoc[idx].tagName === 'article') {
          articleEl = xmlDoc[idx]
        }
      }
    }
    this.convertDocument(articleEl)
    var doc = this.generateDocument()
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
    var nodes = []
    for (var i = startIdx; i < endIdx; i++) {
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

  _nodeData(el, type) {
    var nodeData = super._nodeData(el, type)
    nodeData.attributes = el.getAttributes()
    return nodeData
  }

}

class JATSImporterState extends DOMImporter.State {

  reset() {
    super.reset()
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

JATSImporter.State = JATSImporterState

export default JATSImporter
