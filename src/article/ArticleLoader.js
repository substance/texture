import EditorState from '../shared/EditorState'
import TextureEditorSession from '../shared/TextureEditorSession'
import JATSImporter from './converter/JATSImporter'
import ArticleConfigurator from './ArticleConfigurator'
import ArticleModelPackage from './ArticleModelPackage'

export default {
  load (xml, context) {
    let configurator = new ArticleConfigurator()
    configurator.import(ArticleModelPackage)
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
