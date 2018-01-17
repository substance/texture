
export default class SaveHandler {

  constructor(context) {
    this.context = context
  }

  saveDocument({editorSession}) {
    return new Promise((resolve) => {
      let exporter = this.context.exporter
      let doc = editorSession.getDocument()
      let dom = doc.toXML()
      let result = exporter.export(dom)
      if (result.hasErrored) {
        console.error(result.errors)
        throw new Error('Could not export JATS document')
      }
      console.info(result.dom.getNativeElement())
      // let xml = result.dom.serialize()
      resolve()
    })
  }
}
