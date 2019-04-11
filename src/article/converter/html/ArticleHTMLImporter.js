import { HTMLImporter } from 'substance'

export default class ArticleHTMLImporter extends HTMLImporter {
  constructor (articleConfig, doc) {
    super({
      document: doc,
      converters: _getConverters(articleConfig),
      idAttribute: 'data-id'
    })

    // disabling warnings about default importers
    this.IGNORE_DEFAULT_WARNINGS = true
  }

  _getConverterForElement (el, mode) {
    let converter = super._getConverterForElement(el, mode)
    // provide a backup for unsupported inline content
    if (!converter) {
      if (mode !== 'inline') {
        return _UnsupportedElementImporter
      }
    }
    return converter
  }
}

function _getConverters (articleConfig) {
  return articleConfig.getConverters('html')
}

const _UnsupportedElementImporter = {
  type: 'paragraph',
  import (el, node, converter) {
    node.content = converter.annotatedText(el, [node.id, 'content'], { preserveWhitespace: true })
  }
}
