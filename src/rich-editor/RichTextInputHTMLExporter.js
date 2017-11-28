import { HTMLExporter } from 'substance'

class RichTextInputHTMLExporter extends HTMLExporter {
  convertDocument(doc) {
    let body = doc.get('body')
    let elements = this.convertContainer(body)
    return elements.map((el) => {
      return el.outerHTML
    }).join('')
  }
}

export default RichTextInputHTMLExporter
