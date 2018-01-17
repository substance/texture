import { EditorSession } from 'substance'
import TextureConfigurator from './editor/util/TextureConfigurator'
import EditorPackage from './editor/EditorPackage'
import JATSImporter from './converter/JATSImporter'

export default {
  load(xml, context) {
    let configurator = new TextureConfigurator()
    // TODO: it would make more sense to use a more generic configuration here (TextureJATSPackage)
    // But ATM EditorSession is owning all the managers. So we have to use the EditorPackage.
    configurator.import(EditorPackage)
    // TODO: we need to do deal with errors here
    let jatsImporter = new JATSImporter()
    let jats = jatsImporter.import(xml, context)
    let importer = configurator.createImporter('texture-jats')
    let doc = importer.importDocument(jats.dom)
    let editorSession = new EditorSession(doc, { configurator })
    return editorSession
  }
}
