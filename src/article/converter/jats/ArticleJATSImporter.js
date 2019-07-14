import {
  XMLImporter, last
} from 'substance'
import InternalArticleDocument from '../../InternalArticleDocument'
import jats2internal from './jats2internal'
import UnsupportedInlineNodeConverter from './UnsupportedInlineNodeConverter'
import UnsupportedNodeConverter from './UnsupportedNodeConverter'

export default class ArticleJATSImporter extends XMLImporter {
  import (jats, options = {}) {
    jats2internal(jats, this.state.doc, this)
    return this.state.doc
  }

  annotatedText (el, path, options = {}) {
    const state = this.state
    let context = last(state.contexts)
    // In contrast to the core implementation we want to allow that this is method is used to convert properties
    // with annotated text, outside of a recursive import call
    if (!context) {
      state.pushContext(el.tagName)
    }
    let text = super.annotatedText(el, path, options)
    if (!context) {
      context = state.popContext()
      context.annos.forEach(nodeData => state.doc.create(nodeData))
    }
    return text
  }

  nextId (prefix) {
    // ATTENTION: we gonna use '_' as a prefix for automatically created ids
    // TODO: also do this for nodes created via Document
    let doc = this.state.doc
    let id = this.state.uuid('_' + prefix)
    while (doc.get(id)) {
      id = this.state.uuid('_' + prefix)
    }
    return id
  }

  _createDocument () {
    return InternalArticleDocument.createEmptyArticle(this.state.doc.getSchema())
  }

  _getConverterForElement (el, mode) {
    let converter = super._getConverterForElement(el, mode)
    if (!converter) {
      if (mode === 'inline') {
        return UnsupportedInlineNodeConverter
      } else {
        return UnsupportedNodeConverter
      }
    }
    return converter
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

  _createNode (nodeData) {
    let doc = this.state.doc
    let node = doc.get(nodeData.id)
    if (node) {
      throw new Error('Node already exists')
    }
    return doc.create(nodeData)
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
}
