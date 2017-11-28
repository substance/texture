import { HTMLImporter, isArray } from 'substance'

class RichTextInputHTMLImporter extends HTMLImporter {
  convertDocument(bodyEls) {
    if (!isArray(bodyEls)) {
      bodyEls = [ bodyEls ]
    }
    this.convertContainer(bodyEls, 'body')
  }
}

export default RichTextInputHTMLImporter
