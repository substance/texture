import { EditorSession } from 'substance'
import JATSImporter from './converter/JATSImporter'
import TextureArticlePackage from './TextureArticlePackage'
import ArticleConfigurator from './ArticleConfigurator'

export default {
  load (xml, context, config) {
    let configurator = new ArticleConfigurator()
    configurator.import(TextureArticlePackage)
    let jatsImporter = new JATSImporter()
    let jats = jatsImporter.import(xml, context)
    if (jats.hasErrored) {
      let err = new Error()
      err.type = 'jats-import-error'
      err.detail = jats.errors
      throw err
    }
    let importer = configurator.createImporter('texture-article')
    let doc = importer.importDocument(jats.dom)
    let editorSession = new EditorSession(doc, { configurator, context })
    return editorSession
  }
}
