import { prettyPrintXML, platform } from 'substance'

export default class ArticleSerializer {
  export (doc, config) {
    let articleConfig = config.getConfiguration('article')

    // TODO: depending on the article type we should use a specifc exporter
    let exporter = articleConfig.createExporter('jats')
    let res = exporter.export(doc)
    let jats = res.jats

    // TODO: and depending on the article type we should use a specific transformation
    let transformation = articleConfig.getTransformation('jats')
    transformation.export(jats)

    // for the purpose of debugging
    if (platform.inBrowser) {
      console.info('saving jats', jats.getNativeElement())
    }

    return prettyPrintXML(jats)
  }
}
