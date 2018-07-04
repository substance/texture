/** 
 * @module dar/DocumentArchiveReadOnlyExporter
 * 
 * @description
 * A service class which offers various methods to export a read-only document 
 * archive (read-only DAR) to various formats/representations
 */
export default class DocumentArchiveReadOnlyExporter {
    
    /**
     * Exports a read-only DAR to a raw version
     * 
     * @param {Object} archive The DAR to export
     * @returns {Promise} A promise that will be resolved with the exported version 
     * of the DAR or rejected with errors that occured during the export process
     */
    static export(archive) {
        return new Promise(function(resolve, reject) {
            try 
            {
                /**
                 * The buffer will not be taken into consideration since
                 * we assume that the incoming archive is a read-only DAR and
                 * thus has no buffer
                 */
                let buffer = null

                let archiveSessions = archive.getSessions()
                
                let rawAssets = DocumentArchiveReadOnlyExporter._exportAssets(archiveSessions, buffer)
                let rawManifest = DocumentArchiveReadOnlyExporter._exportManifest(archiveSessions, buffer)
                let rawDocuments = DocumentArchiveReadOnlyExporter._exportDocuments(archiveSessions, buffer)
                
                resolve({
                    diff: [],
                    resources: Object.assign({}, rawAssets, rawManifest, rawDocuments),
                    version: archive.getVersion()
                })
            }
            catch(errors)
            {
                reject(errors)
            }
        })
    }

    /**
     * Export the assets of the DAR to a raw version
     * 
     * @param {Object} archiveSessions The sessions of the DAR 
     * @param {Object} buffer The buffer of the DAR which contains pending changes
     * @returns {Object} The raw assets of the DAR
     */
    static _exportAssets(archiveSessions, buffer) {
        let assets = {},
            manifest = archiveSessions["manifest"].getDocument(),
            assetNodes = manifest.getAssetNodes()
        
        // TODO how can assets be exported for read only DAR?
        if (!buffer) {
            return assets
        }

        assetNodes.forEach(node => {
            let id = node.attr('id')
            
            if (!buffer.hasBlob(id) ) {
                return
            }

            let path = node.attr('path') || id,
                blobRecord = buffer.getBlob(id)
            
            assets[path] = {
                id,
                data: blobRecord.blob,
                encoding: 'blob',
                createdAt: Date.now(),
                updatedAt: Date.now()
            }
        })

        return assets
    }

    /**
     * Export the manifest of the DAR to a raw version
     * 
     * @param {Object} archiveSessions The sessions of the DAR 
     * @param {Object} buffer The buffer of the DAR which contains pending changes
     * @returns {Object} The raw manifest of the DAR
     */
    static _exportManifest(archiveSessions, buffer) {
        return {}
    }

    /**
     * Export the documents of the DAR to a raw version
     * 
     * @param {Object} archiveSessions The sessions of the DAR 
     * @param {Object} buffer The buffer of the DAR which contains pending changes
     * @returns {Object} The raw documents of the DAR
     */
    static _exportDocuments(archiveSessions, buffer) {
        return {}
    }
}