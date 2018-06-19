import { EditorSession } from 'substance'
import TextureConfigurator from './editor/util/TextureConfigurator'
import { JATSImporter } from './article'

export default {
  load(xml, context, config) {
    let configurator = new TextureConfigurator()
    // TODO: we should not mix config for app and model, so this should work differently
    // See https://github.com/substance/texture/issues/544
    configurator.import(config.ArticleConfig)
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
