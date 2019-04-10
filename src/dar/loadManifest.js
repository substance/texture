import {
  Configurator, DocumentSession, registerSchema, XMLDocumentImporter
} from 'substance'
import ManifestSchema from './ManifestSchema'
import ManifestDocument from './ManifestDocument'

export default function loadManifest (xmlStr) {
  // TODO: get rid XMLDocumentImporter and this way of defining a schema
  let configurator = new Configurator()
  registerSchema(configurator, ManifestSchema, ManifestDocument, {
    ImporterClass: XMLDocumentImporter
  })
  let manifest = new ManifestDocument(configurator.getSchema())
  // FIXME: this API is now inconsistent with the general DOMImporter
  let importer = configurator.createImporter(ManifestSchema.getName(), {}, { document: manifest })
  manifest = importer.importDocument(xmlStr)
  return new DocumentSession(manifest)
}
