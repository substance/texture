export default class SaveHandler {

  constructor(context) {
    this.context = context
  }

  saveDocument({editorSession}) {
    return new Promise((resolve, reject) => {
      let exporter = this.context.exporter
      let doc = editorSession.getDocument()
      let xml = exporter.exportDocument(doc)
      this.context.xmlStore.writeXML(this.context.documentId, xml, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}
