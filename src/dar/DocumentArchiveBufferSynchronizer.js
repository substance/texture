export default class DocumentArchiveBufferSynchronizer {
    
    applyPendingChanges(buffer, upstreamDocumentArchive) {
        return new Promise(function(resolve, reject) {
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

    synchronize(buffer, upstreamDocumentArchive) {
        return new Promise(function(resolve, reject) {
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