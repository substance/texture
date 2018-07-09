import EditorState from '../shared/EditorState'
import TextureEditorSession from '../shared/TextureEditorSession'
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
    let editorState = new EditorState(doc)
    let editorSession = new TextureEditorSession(editorState, configurator)
    return editorSession
  }
}
