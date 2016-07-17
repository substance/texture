import isString from 'lodash/isString'
import XMLExporter from 'substance/model/XMLExporter'

class JATSExporter extends XMLExporter {

  exportDocument(doc) {
    this.state.doc = doc

    var articleEl = this.convertNode(doc.get('article'))
    return articleEl.outerHTML
  }

  convertNode(node) {
    var el = super.convertNode(node)
    if (isString(node)) {
      node = this.state.doc.get(node)
    }
    el.attr(node.attributes)
    return el
  }

  convertNodes(nodes) {
    var els = []
    var converter = this
    if (nodes._isArrayIterator) {
      while(nodes.hasNext()) {
        els.push(converter.convertNode(nodes.next()))
      }
    } else {
      nodes.forEach(function(node) {
        els.push(converter.convertNode(node))
      })
    }
    return els
  }
}

export default JATSExporter
