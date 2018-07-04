import DocumentArchiveReadOnlyExporter from "./DocumentArchiveReadOnlyExporter";

export default class DocumentArchiveReadWriteExporter extends DocumentArchiveReadOnlyExporter {
    /*
     * Uses the current state of the buffer to generate a rawArchive object
     * containing all changed documents
     */
    static export(archive) {
        return new Promise(function(resolve, reject) {
            try 
            {
                let buffer = archive.getBuffer()

                let rawArchive = {
                    version: buffer.getVersion(),
                    diff: buffer.getChanges(),
                    resources: {}
                }

                let archiveSessions = archive.getSessions()

                rawArchive = DocumentArchiveReadWriteExporter._exportAssets(archiveSessions, buffer, rawArchive)
                rawArchive = DocumentArchiveReadWriteExporter._exportManifest(archiveSessions, buffer, rawArchive)
                rawArchive = DocumentArchiveReadWriteExporter._exportDocuments(archiveSessions, buffer, rawArchive)
                resolve(rawArchive)
            }
            catch(errors)
            {
                reject(errors)
            }
        })
    }
}