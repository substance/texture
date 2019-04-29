/**
 * A converter for JATS `<p>`.
 */
export default class ParagraphConverter {
  get type () { return 'paragraph' }

  get tagName () { return 'p' }

  import (el, node, importer) {
    node.content = importer.annotatedText(el, [node.id, 'content'])
  }

  export (node, el, exporter) {
    el.append(exporter.annotatedText([node.id, 'content']))
  }
}
