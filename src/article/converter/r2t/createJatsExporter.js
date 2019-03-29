
import { XMLExporter, isString } from 'substance'
import converters from './_converters'

/**
 * A factory the creates an exporter instance that can be used to convert a full document to JATS
 * but also for converting single nodes.
 *
 * @param {DOMElement} jatsDom
 * @param {InternalArticleDocument} doc
 */
export default function createJatsExporter (jatsDom, doc) {
  // ATTENTION: in this case it is different to the importer
  // not the first matching converter is used, but the last one which is
  // registered for a specific nody type, i.e. a later converter overrides a previous one
  let exporter = new Internal2JATSExporter({
    converters,
    elementFactory: {
      createElement: jatsDom.createElement.bind(jatsDom)
    }
  })
  exporter.state.doc = doc
  return exporter
}

class Internal2JATSExporter extends XMLExporter {
  getNodeConverter (node) {
    let type = node.type
    if (node.isInstanceOf('reference')) {
      type = 'reference'
    }
    return this.converters.get(type)
  }

  // TODO: try to improve the core implementation to allow disabling of defaultBlockConverter
  convertNode (node) {
    if (isString(node)) {
      // Assuming this.state.doc has been set by convertDocument
      node = this.state.doc.get(node)
    } else {
      this.state.doc = node.getDocument()
    }
    var converter = this.getNodeConverter(node)
    // special treatment for annotations, i.e. if someone calls
    // `exporter.convertNode(anno)`
    if (node.isPropertyAnnotation() && (!converter || !converter.export)) {
      return this._convertPropertyAnnotation(node)
    }
    if (!converter) {
      throw new Error(`No converter found for node type '${node.type}'`)
    }
    var el
    if (converter.tagName) {
      el = this.$$(converter.tagName)
    } else {
      el = this.$$('div')
    }
    el.attr(this.config.idAttribute, node.id)
    if (converter.export) {
      el = converter.export(node, el, this) || el
    }
    return el
  }
}
