import { forEach } from 'substance'
import JATSImporter from './converter/JATSImporter'
import ArticleConfigurator from './ArticleConfigurator'
import ArticleModelPackage from './ArticleModelPackage'
import ArticleSession from './ArticleSession'

export default {
  load (xml, context) {
    let configurator = new ArticleConfigurator()
    configurator.import(ArticleModelPackage)
    let jatsImporter = new JATSImporter()
    const pubMetaSession = context.pubMetaSession
    const pubMetaDb = pubMetaSession.getDocument()
    // TODO: find a more consistent notion of 'context'
    let jats = jatsImporter.import(xml, { pubMetaDb })
    if (jats.hasErrored) {
      let err = new Error()
      err.type = 'jats-import-error'
      err.detail = jats.errors
      throw err
    }
    let importer = configurator.createImporter('texture-article')
    let doc = importer.importDocument(jats.dom)
    forEach(pubMetaDb.getNodes(), entity => {
      doc.create(entity)
    })
    let editorSession = new ArticleSession(doc, configurator)
    return editorSession
  }
}
