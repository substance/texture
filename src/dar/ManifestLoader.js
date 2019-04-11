import { DocumentSession } from 'substance'
import ManifestDocument from './ManifestDocument'

export default {
  load (manifestXml) {
    return new DocumentSession(ManifestDocument.fromXML(manifestXml))
  }
}
