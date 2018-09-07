import { XMLDocumentImporter } from 'substance'
import JATSSchema from '../../TextureArticle'
import InternalArticleSchema from '../../InternalArticleSchema'
import { createXMLConverters } from '../../shared/xmlSchemaHelpers'
// TODO: rename to XML helpers
import BodyConverter from './BodyConverter'
import DispQuoteConverter from './DispQuoteConverter'
import FigConverter from './FigConverter'
import ElementCitationConverter from './ElementCitationConverter'
import ListConverter from './ListConverter'
import TableConverter from './TableConverter'
import TableWrapConverter from './TableWrapConverter'
import UnsupportedNodeConverter from './UnsupportedNodeConverter'
import UnsupportedInlineNodeConverter from './UnsupportedInlineNodeConverter'

export default function createJatsImporter (doc) {
  // Note: we are applying a hybrid approach, i.e. we create XML importers for the JATS schema
  // but only for those elements which are supported by our internal article schema.
  let jatsSchema = JATSSchema.xmlSchema
  let tagNames = jatsSchema.getTagNames().filter(name => Boolean(InternalArticleSchema.getNodeClass(name)))
  let jatsConverters = createXMLConverters(JATSSchema.xmlSchema, tagNames)
  let converters = [
    new BodyConverter(),
    // this is only used for import, because BodyConverter does an on-the-fly DOM transformation
    // before calling element converters. Thus, in the export direction headings are already transformed into <sec> elements
    HeadingImporter,
    new DispQuoteConverter(),
    new FigConverter(),
    new ListConverter(),
    new TableWrapConverter(),
    new TableConverter(),
    new ElementCitationConverter()
  ].concat(jatsConverters)
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
}

const HeadingImporter = {
  type: 'heading',
  tagName: 'heading',
  import (el, node, importer) {
    // Note: attributes are converted automatically
    node.content = importer.annotatedText(el, [node.id, 'content'])
  }
}
