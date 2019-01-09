import { HTMLImporter } from 'substance'
import InternalArticleSchema from '../../InternalArticleSchema'

export default class ArticleHTMLImporter extends HTMLImporter {
  constructor (configurator) {
    super({
      schema: InternalArticleSchema,
      // HACK: in contrast to DOMExporter, DOMImporter takes an array of converters, instead of a Registry
      converters: _getConverters(configurator),
      idAttribute: 'data-id'
    })
  }

  // TODO: it is necessary to set the document instance so that the importer is creating nodes for this document
  setDocument (doc) {
    this.reset()
    this.state.doc = doc
  }

  _getConverterForElement (el, mode) {
    let converter = super._getConverterForElement(el, mode)
    // apply a fallback
    if (!converter) {
      if (mode !== 'inline') {
        return UnsupportedElementImporter
      }
    }
    return converter
  }
}

// TODO: we should improve the configurators internal format, e.g. use Map instead of {}
function _getConverters (configurator) {
  return configurator.getConverters('html').values()
}

const UnsupportedElementImporter = {
  type: 'paragraph',
  import (el, node, converter) {
    node.content = converter.annotatedText(el, [node.id, 'content'], { preserveWhitespace: true })
  }
}
