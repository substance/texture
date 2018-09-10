export default class ArticlePlainTextExporter {
  export (article) {
    console.error('TODO: implement full article to plain-text conversion')
  }

  exportNode (node) {
    if (node.isContainer()) {
      return node.getNodes().map(node => {
        return this.exportNode(node)
      }).join('\n')
    } else if (node.isText()) {
      return node.getText()
    } else {
      console.error('TODO: implement node -> plain-text conversion for node type', node.type)
      return ''
    }
  }
}