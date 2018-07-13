import DocumentArchiveReadOnly from "./DocumentArchiveReadOnly"
import DocumentArchiveReadWrite from "./DocumentArchiveReadWrite"
import DocumentArchiveTypes from "./DocumentArchiveTypes"

/** 
 * @module dar/DocumentArchiveFactory
 * 
 * @description
 * A service class which offers various methods to create 
 * document archive instances
 */
export default class DocumentArchiveFactory {

  /**
   * Creates a document archive instance based upon an incoming 
   * document archive configuration
   * 
   * @param {Object} documentArchiveConfig A configuration for a document archive 
   * @return {Object} A document archive instance or null (default)
   */
  static getDocumentArchive(documentArchiveConfig) {
    let documentArchive

    switch (documentArchiveConfig.getId()) {

      case DocumentArchiveTypes.READ_ONLY:
        documentArchive = new DocumentArchiveReadOnly(documentArchiveConfig)
        break;

      case DocumentArchiveTypes.READ_WRITE:
        documentArchive = new DocumentArchiveReadWrite(documentArchiveConfig)
        break;

      default:
        documentArchive = null
    }

    return documentArchive
  }
}