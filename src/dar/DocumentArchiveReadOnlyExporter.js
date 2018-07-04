export default class DocumentArchiveReadOnlyExporter {
    /*
     * Uses the current state of the buffer to generate a rawArchive object
     * containing all changed documents
     */
    static export(archive) {
        return new Promise(function(resolve, reject) {
            try 
            {
                let buffer = null
                
                let rawArchive = {
                    version: archive.getVersion(),
                    diff: [],
                    resources: {}
                }

                let archiveSessions = archive.getSessions()

                rawArchive = DocumentArchiveReadOnlyExporter._exportAssets(archiveSessions, buffer, rawArchive)
                rawArchive = DocumentArchiveReadOnlyExporter._exportManifest(archiveSessions, buffer, rawArchive)
                rawArchive = DocumentArchiveReadOnlyExporter._exportDocuments(archiveSessions, buffer, rawArchive)
                resolve(rawArchive)
            }
            catch(errors)
            {
                reject(errors)
            }
        })
    }

    static _exportAssets(archiveSessions, buffer, rawArchive) {
        let manifest = archiveSessions["manifest"].getDocument(),
            assetNodes = manifest.getAssetNodes()
        
        // TODO how can assets be exported for read only DAR?
        if (!buffer) {
            return rawArchive
        }

        assetNodes.forEach(node => {
            let id = node.attr('id')
            
            if (!buffer.hasBlob(id) ) {
                return
            }

            let path = node.attr('path') || id,
                blobRecord = buffer.getBlob(id)
            
            rawArchive.resources[path] = {
                id,
                data: blobRecord.blob,
                encoding: 'blob',
                createdAt: Date.now(),
                updatedAt: Date.now()
            }
        })

        return rawArchive
    }

    static _exportManifest(archiveSessions, buffer, rawArchive) {
        return rawArchive
    }

    static _exportDocuments(archiveSessions, buffer, rawArchive) {
        return rawArchive
    }
}