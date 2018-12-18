
import { XMLExporter } from 'substance'
import JATSSchema from '../../TextureArticle'
import InternalArticleSchema from '../../InternalArticleSchema'
import { createXMLConverters } from '../../shared/xmlSchemaHelpers'
import BodyConverter from './BodyConverter'
import DispFormulaConverter from './DispFormulaConverter'
import DispQuoteConverter from './DispQuoteConverter'
import FigureConverter from './FigureConverter'
import FigurePanelConverter from './FigurePanelConverter'
import FootnoteConverter from './FootnoteConverter'
import TexMathConverter from './TexMathConverter'
import ListConverter from './ListConverter'
import PermissionsConverter from './PermissionsConverter'
import PreformatConverter from './PreformatConverter'
import TableConverter from './TableConverter'
import TableFigureConverter from './TableFigureConverter'
import SupplementaryFileConverter from './SupplementaryFileConverter'
import ElementCitationConverter from './ElementCitationConverter'
import UnsupportedNodeConverter from './UnsupportedNodeConverter'
import UnsupportedInlineNodeConverter from './UnsupportedInlineNodeConverter'
import XrefConverter from './XrefConverter'

/**
 * A factory the creates an exporter instance that can be used to convert a full document to JATS
 * but also for converting single nodes.
 *
 * @param {DOMElement} jatsDom
 * @param {InternalArticleDocument} doc
 */
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
    new DispFormulaConverter(),
    new DispQuoteConverter(),
    new FigureConverter(),
    new FigurePanelConverter(),
    new FootnoteConverter(),
    new TexMathConverter(),
    new ListConverter(),
    new PermissionsConverter(),
    new PreformatConverter(),
    new SupplementaryFileConverter(),
    new TableFigureConverter(),
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
