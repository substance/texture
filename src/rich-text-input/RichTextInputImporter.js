import { HTMLImporter } from 'substance'

export default class RichTextInputImporter extends HTMLImporter {
  convertDocument(documentEl) {
    let body = documentEl.find('body')
    this.convertElement(body)
  }
}
