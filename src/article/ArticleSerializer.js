import { prettyPrintXML } from 'substance'

export default class ArticleSerializer {
  export (doc, config) {
    let articleConfig = config.getConfiguration('article')

    // TODO: depending on the article type we should use a specifc exporter
    let exporter = articleConfig.createExporter('jats')
    let res = exporter.export(doc)
    let jats = res.jats
    console.info('saving jats', jats.getNativeElement())
    let xmlStr = prettyPrintXML(jats)
    return xmlStr
  }
}
