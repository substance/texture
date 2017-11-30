import { HTMLExporter } from 'substance'

export default class RichTextInputExporter extends HTMLExporter {
  convertDocument(doc) {
    let el = this.convertNode(doc.get('body'))
    return el.innerHTML
  }
}
