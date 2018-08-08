import {
  Configurator, registerSchema, XMLDocumentImporter
} from 'substance'
import {
  DocumentSession
} from '../kit'
import ManifestSchema from './ManifestSchema'
import ManifestDocument from './ManifestDocument'

export default function loadManifest (xmlStr) {
  let configurator = new Configurator()
  registerSchema(configurator, ManifestSchema, ManifestDocument, {
    ImporterClass: XMLDocumentImporter
  })
  let importer = configurator.createImporter(ManifestSchema.getName())
  let manifest = importer.importDocument(xmlStr)
  return new DocumentSession(manifest)
}
