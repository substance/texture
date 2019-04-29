import { XMLExporter, isString } from 'substance'
import internal2jats from './internal2jats'

export default class ArticleJATSExporter extends XMLExporter {
  constructor (articleConfig, document, { converters }) {
    super({ document, converters })
  }

  /*
    Takes a InternalArticle document as a DOM and transforms it into a JATS document,
    following TextureArticle guidelines.
  */
  export (doc) {
    // TODO: consolidate DOMExporter / XMLExporter
    this.state.doc = doc
    let jats = internal2jats(doc, this)
    return {
      jats,
      ok: true,
      errors: []
    }
  }

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
