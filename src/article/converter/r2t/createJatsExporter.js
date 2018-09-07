import { XMLExporter } from 'substance'
import JATSSchema from '../../TextureArticle'
import InternalArticleSchema from '../../InternalArticleSchema'
import { createXMLConverters } from '../../shared/xmlSchemaHelpers'
import BodyConverter from './BodyConverter'
import DispQuoteConverter from './DispQuoteConverter'
import FigConverter from './FigConverter'
import ListConverter from './ListConverter'
import TableConverter from './TableConverter'
import TableWrapConverter from './TableWrapConverter'
import ElementCitationConverter from './ElementCitationConverter'
import UnsupportedNodeConverter from './UnsupportedNodeConverter'
import UnsupportedInlineNodeConverter from './UnsupportedInlineNodeConverter'
import XrefConverter from './XrefConverter'

export default function createJatsExporter (jatsDom, doc) {
  // Note: we are applying a hybrid approach, i.e. we create XML importers for the JATS schema
  // but only for those elements which are supported by our internal article schema.
  let jatsSchema = JATSSchema.xmlSchema
  let tagNames = jatsSchema.getTagNames().filter(name => Boolean(InternalArticleSchema.getNodeClass(name)))
  let jatsConverters = createXMLConverters(JATSSchema.xmlSchema, tagNames)
  // ATTENTION: in this case it is different to the importer
  // not the first matching converter is used, but the last one which is
  // registered for a specific nody type, i.e. a later converter overrides a previous one
  let converters = jatsConverters.concat([
    new BodyConverter(),
    new DispQuoteConverter(),
    new FigConverter(),
    new ListConverter(),
    new TableWrapConverter(),
    new TableConverter(),
    new ElementCitationConverter(),
    UnsupportedNodeConverter,
    UnsupportedInlineNodeConverter,
    new XrefConverter()
  ])
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
    if (node.isInstanceOf('bibr')) {
      type = 'bibr'
    }
    return this.converters.get(type)
  }
}
