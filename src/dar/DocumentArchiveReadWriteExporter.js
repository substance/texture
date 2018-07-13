import DocumentArchiveReadOnlyExporter from "./DocumentArchiveReadOnlyExporter";

/** 
 * @module dar/DocumentArchiveReadWriteExporter
 * 
 * @description
 * A service class which offers various methods to export a read-write document 
 * archive (read-write DAR) to various formats/representations
 */
export default class DocumentArchiveReadWriteExporter {

  /**
   * Exports a read-write DAR to a raw version
   * 
   * @param {Object} archive The DAR to export
   * @returns {Promise} A promise that will be resolved with the exported version 
   * of the DAR or rejected with errors that occured during the export process
   */
  static
  export (archive) {
    return new Promise(function (resolve, reject) {
      try {
        /*
         * Uses the current state of the buffer to generate a rawArchive object
         * containing all changed documents
         */
        let buffer = archive.getBuffer()

        let archiveSessions = archive.getSessions()

        let rawAssets = DocumentArchiveReadOnlyExporter._exportAssets(archiveSessions, buffer)
        let rawManifest = DocumentArchiveReadOnlyExporter._exportManifest(archiveSessions, buffer)
        let rawDocuments = DocumentArchiveReadOnlyExporter._exportDocuments(archiveSessions, buffer)

        resolve({
          diff: buffer.getChanges(),
          resources: Object.assign({}, rawAssets, rawManifest, rawDocuments),
          version: buffer.getVersion()
        })
      } catch (errors) {
        reject(errors)
      }
    })
  }
}