export default class SaveHandler {

  constructor(context) {
    this.context = context
  }

  saveDocument(doc, changes, cb) {
    let exporter = this.context.exporter
    let xml = exporter.exportDocument(doc)
    // console.log('### SAVING XML', xml);
    this.context.xmlStore.writeXML(this.context.documentId, xml, cb)
  }

}
