import { HTMLImporter } from 'substance'

export default class RichtextHTMLImporter extends HTMLImporter {
  convertDocument(documentEl) {
    let body = documentEl.find('body')
    this.convertElement(body)
  }
}
