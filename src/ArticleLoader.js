import { EditorSession } from 'substance'
import TextureConfigurator from './editor/util/TextureConfigurator'
import EditorPackage from './editor/EditorPackage'
import JATSImporter from './converter/JATSImporter'

export default {
  load(xml) {
    let configurator = new TextureConfigurator()
    // TODO: it would make more sense to use a more generic configuration here (TextureJATSPackage)
    // But ATM EditorSession is owning all the managers. So we have to use the EditorPackage.
    configurator.import(EditorPackage)
    let jatsImporter = new JATSImporter()
    let jats = jatsImporter.import(xml)
    let importer = configurator.createImporter('texture-jats')
    let doc = importer.importDocument(jats.dom)
    // TODO: we need to do deal with errors here
    let editorSession = new EditorSession(doc, { configurator })
    return editorSession
  }
}
