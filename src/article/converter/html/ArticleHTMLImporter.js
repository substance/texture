import { HTMLImporter } from 'substance'

export default class ArticleHTMLImporter extends HTMLImporter {
  _getUnsupportedElementConverter () {
    return _UnsupportedElementImporter
  }
}

const _UnsupportedElementImporter = {
  type: 'paragraph',
  import (el, node, converter) {
    node.content = converter.annotatedText(el, [node.id, 'content'], { preserveWhitespace: true })
  }
}
