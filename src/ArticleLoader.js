import { EditorSession } from 'substance'
import TextureConfigurator from './editor/util/TextureConfigurator'
import EditorPackage from './editor/EditorPackage'
import { JATSImporter } from './article'

export default {
  load(xml, context) {
    let configurator = new TextureConfigurator()
    // TODO: it would make more sense to use a more generic configuration here (TextureArticlePackage)
    // But ATM EditorSession is owning all the managers. So we have to use the EditorPackage.
    configurator.import(EditorPackage)
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
