import {
    prettyPrintXML
} from 'substance'
import JATSExporter from "../article/converter/JATSExporter"

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
    static export (archive) {
        return new Promise(function (resolve, reject) {
            try {
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

                let resources = Object.assign({}, rawAssets, rawManifest, rawDocuments) 

                resolve({
                    diff: [],
                    resources: resources,
                    version: archive.getVersion()
                })
            } catch (errors) {
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
        let assets = {}

        // TODO How can we export assets for read only DAR?
        if (!buffer) {
            return assets
        }

        let assetNodes = archiveSessions["manifest"].getDocument().getAssetNodes()

        assetNodes.forEach(node => {
            let id = node.attr('id')

            if (!buffer.hasBlob(id)) {
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
        let manifestExported = {}

        if (!buffer) {
            return manifestExported
        }

        let manifest = archiveSessions["manifest"].getDocument()

        // TODO check why this is necessary
        if ( !buffer.hasResourceChanged('manifest') ) {
            return manifestExported
        }

        //The serialised manifest should have no pub-meta document entry, so we
        //remove it here.
        let manifestDom = manifest.toXML(),
            documents = manifestDom.find('documents'),
            pubMetaEl = documents.find('document#pub-meta')

        if (pubMetaEl) {
            documents.removeChild(pubMetaEl)
        }
        
        manifestExported["manifest.xml"] = {
            id: 'manifest',
            data: prettyPrintXML(manifestDom),
            encoding: 'utf8',
            updatedAt: Date.now()
        }

        return manifestExported
    }

    /**
     * Export the documents of the DAR to a raw version
     * 
     * @param {Object} archiveSessions The sessions of the DAR 
     * @param {Object} buffer The buffer of the DAR which contains pending changes
     * @returns {Object} The raw documents of the DAR
     */
    static _exportDocuments(archiveSessions, buffer) {
        // Note: we are only adding resources that have changed
        // and only those which are registered in the manifest
        let documents = {}

        // TODO How can we export documents for read only DAR?
        if (!buffer) {
            return documents
        }

        let entries = archiveSessions["manifest"].getDocument().getDocumentEntries()

        entries.forEach(entry => {
            let {
                id,
                type,
                path
            } = entry

            // We will never persist pub-meta
            if (type === 'pub-meta') return

            // We mark a resource dirty when it has changes, or if it is an article
            // and pub-meta has changed
            if (buffer.hasResourceChanged(id) || (type === 'article' && buffer.hasResourceChanged('pub-meta'))) {
                let session = archiveSessions[id]
                // TODO: how should we communicate file renamings?
                documents[path] = {
                    id,
                    // HACK: same as when loading we pass down all sessions so that we can do some hacking there
                    data: DocumentArchiveReadOnlyExporter._exportDocument(type, session, archiveSessions),
                    encoding: 'utf8',
                    updatedAt: Date.now()
                }
            }
        })

        return documents
    }

    static _exportDocument(type, session, sessions) {
        switch (type) {
            case 'article':
                {
                    let jatsExporter = new JATSExporter()
                    let pubMetaDb = sessions['pub-meta'].getDocument()
                    let doc = session.getDocument()
                    let dom = doc.toXML()
                    let res = jatsExporter.export(dom, {
                        pubMetaDb,
                        doc
                    })
                    console.info('saving jats', res.dom.getNativeElement())
                    let xmlStr = prettyPrintXML(res.dom)
                    return xmlStr
                }
            default:
                throw new Error('Unsupported document type')
        }
    }
}