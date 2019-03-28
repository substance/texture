export default class HeadingImporter {
  get type () { return 'heading' }
  get tagName () { return 'heading' }
  import (el, node, importer) {
    // Note: attributes are converted automatically
    node.level = parseInt(node.attributes.level, 10)
    node.content = importer.annotatedText(el, [node.id, 'content'])
  }
}
