import { DefaultDOMElement, HTMLImporter } from 'substance'

export default class RichtextHTMLImporter extends HTMLImporter {
  importDocument(html) {
    this.reset()
    let parsed = DefaultDOMElement.parseHTML(html)
    let body = parsed.find('body')
    let content = this.annotatedText(body, ['content-node', 'content'])
    let node = {
      id: 'content-node',
      type: 'html-content',
      content
    }
    this.state.doc.create(node)
    return this.state.doc
  }
}
