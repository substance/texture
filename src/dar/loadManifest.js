import {
  Configurator, EditorSession, registerSchema, XMLDocumentImporter,
} from 'substance'

import ManifestSchema from './ManifestSchema'
import ManifestDocument from './ManifestDocument'

export default function loadManifest(xmlStr) {
  let configurator = new Configurator()
  registerSchema(configurator, ManifestSchema, ManifestDocument, {
    ImporterClass: XMLDocumentImporter
  })
  let importer = configurator.createImporter(ManifestSchema.getName())
  let manifest = importer.importDocument(xmlStr)
  let editorSession = new EditorSession(manifest, { configurator })
  return editorSession
}
