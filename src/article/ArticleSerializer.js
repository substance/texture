import { prettyPrintXML, platform } from 'substance'
import { DEFAULT_JATS_SCHEMA_ID } from './ArticleConstants'

export default class ArticleSerializer {
  export (doc, config) {
    let articleConfig = config.getConfiguration('article')

    // EXPERIMENTAL: I am not sure yet, if this is the right way to use
    // exportes and transformers.
    // During import we store the original docType on the document instance
    // Now we use this to create the corresponding exporter
    let docType = doc.docType || DEFAULT_JATS_SCHEMA_ID

    let exporter = articleConfig.createExporter(docType, doc)
    if (!exporter) {
      console.error(`No exporter registered for "${docType}". Falling back to default JATS importer, but with unpredictable result.`)
      // Falling back to default importer
      exporter = articleConfig.createExporter('jats', doc)
    }
    let res = exporter.export(doc)
    let jats = res.jats

    let transformation = articleConfig.getTransformation(docType)
    if (transformation) {
      transformation.export(jats)
    }

    let xmlStr = prettyPrintXML(jats)
    // for the purpose of debugging
    if (platform.inBrowser) {
      console.info('saving jats', { el: jats.getNativeElement(), xml: xmlStr })
    }

    return xmlStr
  }
}
