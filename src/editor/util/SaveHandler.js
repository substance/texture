
export default class SaveHandler {

  constructor(context) {
    this.context = context
  }

  saveDocument({editorSession}) {
    return new Promise((resolve, reject) => {
      let exporter = this.context.exporter
      let doc = editorSession.getDocument()
      let dom = doc.toXML()
      let result = exporter.export(dom)
      if (result.hasErrored) {
        console.error(result.errors)
        throw new Error('Could not export JATS document')
      }
      let xml = result.dom.serialize()
      // console.info('Exported XML', result.dom.getNativeElement())
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
