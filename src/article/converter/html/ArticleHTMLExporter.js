import { HTMLExporter, DefaultDOMElement } from 'substance'

export default class ArticleHTMLExporter extends HTMLExporter {
  constructor (articleConfig) {
    super({
      converters: articleConfig.getConverters('html'),
      idAttribute: 'data-id',
      elementFactory: DefaultDOMElement.createDocument('html')
    })
  }

  /*
    Customised annotatedText method, that takes a document and $$ to be
    compatible with other rendering contexts
  */
  annotatedText (path, doc, $$) {
    if (doc) {
      this.state.doc = doc
    }
    if ($$) {
      this.$$ = $$
    }
    return super.annotatedText(path)
  }
}
