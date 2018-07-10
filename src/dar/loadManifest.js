import {
  Configurator, registerSchema, XMLDocumentImporter
} from 'substance'
import TextureEditorSession from '../shared/TextureEditorSession'
import EditorState from '../shared/EditorState'
import ManifestSchema from './ManifestSchema'
import ManifestDocument from './ManifestDocument'

export default function loadManifest (xmlStr) {
  let configurator = new Configurator()
  registerSchema(configurator, ManifestSchema, ManifestDocument, {
    ImporterClass: XMLDocumentImporter
  })
  let importer = configurator.createImporter(ManifestSchema.getName())
  let manifest = importer.importDocument(xmlStr)
  let editorState = new EditorState(manifest)
  let editorSession = new TextureEditorSession(editorState, configurator)
  return editorSession
}
