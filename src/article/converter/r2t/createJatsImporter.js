import { XMLDocumentImporter, last } from 'substance'
import TextureArticleSchema from '../../TextureArticleSchema'
import InternalArticleSchema from '../../InternalArticleSchema'
import UnsupportedInlineNodeConverter from './UnsupportedInlineNodeConverter'
import UnsupportedNodeConverter from './UnsupportedNodeConverter'
import _converters from './_converters'

export default function createJatsImporter (doc) {
  // Note: we are applying a hybrid approach, i.e. we create XML importers for the JATS schema
  // but only for those elements which are supported by our internal article schema.
  let jatsSchema = TextureArticleSchema.xmlSchema
  // HeadingImporter is only used for import, because BodyConverter does an on-the-fly DOM transformation
  // before calling element converters. Thus, in the export direction headings are already transformed into <sec> elements
  let converters = [HeadingImporter].concat(_converters)
  let jatsImporter = new _HybridJATSImporter({
    schema: InternalArticleSchema,
    xmlSchema: jatsSchema,
    idAttribute: 'id',
    converters
  })
  // ATTENTION: this looks hacky, but we know what we are doing (hopefully)
  jatsImporter.state.doc = doc
  return jatsImporter
}

class _HybridJATSImporter extends XMLDocumentImporter {
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

  _createNode (nodeData) {
    let doc = this.state.doc
    let node = doc.get(nodeData.id)
    if (node) {
      throw new Error('Node already exists')
    }
    return doc.create(nodeData)
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
}

const HeadingImporter = {
  type: 'heading',
  tagName: 'heading',
  import (el, node, importer) {
    // Note: attributes are converted automatically
    node.level = parseInt(node.attributes.level, 10)
    node.content = importer.annotatedText(el, [node.id, 'content'])
  }
}
