
export default class SaveHandler {

  constructor(context) {
    this.context = context
  }

  saveDocument({editorSession}) {
    return new Promise((resolve, reject) => {
      let exporter = this.context.exporter
      let doc = editorSession.getDocument()
      let dom = doc.toXML()
      let jatsDom = exporter.export(dom)
      let xml = jatsDom.serialize()
      // console.info('Exported XML', jatsDom.getNativeElement())
      // console.info('Exported XML', xml)
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
