export default class SaveHandler {

  constructor(context) {
    this.context = context;
  }

  saveDocument(doc, changes, cb) {
    var exporter = this.context.exporter;
    var xml = exporter.exportDocument(doc);
    // console.log('### SAVING XML', xml);
    this.context.xmlStore.writeXML(this.context.documentId, xml, cb);
  }

}
