/** 
 * @module dar/DocumentArchiveBufferSynchronizer
 * 
 * @description
 * A service class which offers various methods synchronize a DARs buffer
 * with the raw upstream version/representation (coming form the server or 
 * file system) of the DAR
 */
export default class DocumentArchiveBufferSynchronizer {
    
    /**
     * TODO Find out what this method is doing and if it has 
     * been applied correctly
     * 
     * @param {Object} documentArchive The document archive 
     * @returns {Promise} A promise that will be resolved with the DAR's synchronized buffer
     * or rejected with errors that occured during the synchronization process
     */
    static applyPendingChanges(documentArchive) {
        return new Promise(function(resolve, reject) {
            let buffer = documentArchive.getBuffer(),
                upstreamDocumentArchive = documentArchive.getUpstreamArchive()

            if ( !buffer.hasPendingChanges() ) {
                // TODO: when we have a persisted buffer we need to apply all pending
                // changes.
                // For now, we always start with a fresh buffer
                resolve(buffer)
            }
                
            buffer.reset( upstreamDocumentArchive.getVersion() )
            resolve(buffer)
        })
    }

    /**
     * TODO Find out what this method is doing and if it has 
     * been applied correctly
     * 
     * @param {Object} documentArchive The document archive
     * @returns {Promise} A promise that will be resolved with the DAR's synchronized buffer
     * or rejected with errors that occured during the synchronization process
     */
    static synchronize(documentArchive) {
        return new Promise(function(resolve, reject) {
            let buffer = documentArchive.getBuffer(),
                upstreamDocumentArchive = documentArchive.getUpstreamArchive()

            if ( !buffer.hasPendingChanges() )
            {
                resolve(buffer)
            }
        
            let localVersion = buffer.getVersion(),
                upstreamVersion = upstreamDocumentArchive.getVersion()

            if (localVersion && upstreamVersion && localVersion !== upstreamVersion) {
                // If the local version is out-of-date, it would be necessary to 'rebase' the
                // local changes.
                console.error('Upstream document has changed. Discarding local changes')
                buffer.reset(upstreamVersion)
            } else {
                buffer.reset(upstreamVersion)
            }

            resolve(buffer)
        })
    }
}