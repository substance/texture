import {
  DefaultDOMElement, DOMImporter, isString,
  ValidatingChildNodeIterator
} from 'substance'

import InternalArticleSchema from './InternalArticleSchema'

export default
class TextureArticleImporter extends DOMImporter {
  constructor (config, context) {
    super({
      idAttribute: 'id',
      schema: config.schema,
      // HACK: usually we use configurator.createImporter()
      converters: config.converters
    }, context)

    this.xmlSchema = InternalArticleSchema
  }

  importDocument (dom) {
    this.reset()
    const doc = this.state.doc
    if (isString(dom)) {
      dom = DefaultDOMElement.parseXML(dom)
    }
    let articleEl = dom.find('article')
    if (!articleEl) throw new Error('Could not find <article> element.')
    doc.article = this.convertElement(articleEl)

    return this.state.doc
  }

  _initialize () {
    const schema = this.schema
    const defaultTextType = schema.getDefaultTextType()
    const converters = this.converters

    this._allConverters = []
    this._propertyAnnotationConverters = []
    this._blockConverters = []

    for (let i = 0; i < converters.length; i++) {
      let converter
      if (typeof converters[i] === 'function') {
        const Converter = converters[i]
        converter = new Converter()
      } else {
        converter = converters[i]
      }
      if (!converter.type) {
        throw new Error('Converter must provide the type of the associated node.')
      }
      if (!converter.matchElement && !converter.tagName) {
        throw new Error('Converter must provide a matchElement function or a tagName property.')
      }
      if (!converter.matchElement) {
        converter.matchElement = this._defaultElementMatcher.bind(converter)
      }
      const NodeClass = schema.getNodeClass(converter.type)
      if (!NodeClass) {
        throw new Error('No node type defined for converter')
      }
      if (!this._defaultBlockConverter && defaultTextType === converter.type) {
        this._defaultBlockConverter = converter
      }

      // TODO: need to rethink this
      if (NodeClass.prototype._isAnnotation) {
        this._propertyAnnotationConverters.push(converter)
      } else {
        this._blockConverters.push(converter)
      }
    }
    if (!this._defaultBlockConverter) {
      throw new Error(`No converter for defaultTextType ${defaultTextType}`)
    }
    this._allConverters = this._blockConverters.concat(this._propertyAnnotationConverters)
  }

  _createNodeData (el, type) {
    let nodeData = super._createNodeData(el, type)
    let attributes = {}
    el.getAttributes().forEach((value, key) => {
      attributes[key] = value
    })
    nodeData.attributes = attributes
    return nodeData
  }

  getChildNodeIterator (el) {
    // TODO: this looks very hacky. Why do we need el plus it?
    let schema = this.xmlSchema.getElementSchema(el.tagName)
    let it = el.getChildNodeIterator()
    return new ValidatingChildNodeIterator(el, it, schema.expr)
  }

  _getIdForElement (el, type) {
    if (type === 'article') {
      return 'article'
    } else {
      return super._getIdForElement(el, type)
    }
  }

  _convertPropertyAnnotation () {
    throw new Error('stand-alone annotations are not supported.')
  }

  _convertInlineNode (el, nodeData, converter) {
    const path = []
    if (converter.import) {
      nodeData = converter.import(el, nodeData, this) || nodeData
    }
    nodeData.start = { path, offset: 0 }
    nodeData.end = { offset: 0 }
    return nodeData
  }
}
