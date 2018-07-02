import { EventEmitter, forEach } from "substance"

import DocumentLoader from "./DocumentLoader"
import ManifestLoader from "./ManifestLoaderNew"

/** 
 * @module dar/DocumentArchiveReadOnly
 * 
 * @description
 * A read only DAR which contains only a subset of the functionality 
 * of the PersistedDocumentArchive. It is intended to be used for the usage
 * within reader application which don't need to modify DARs.
 * 
 * During the loading of an archive not only the raw DAR archive will be loaded
 * from storage but also the internal representations of the DAR's manifest (as 
 * an instance of ManifestDocument) as well as all the DAR's documents (as instances
 * of TextureArticle).
 */
export default class DocumentArchiveReadOnly extends EventEmitter {

    constructor(documentArchiveConfig) {
        super()
        this._archiveId = null,
        this._documents = null,
        this._manifest = null,
        this._manifestLoader = null,
        this._rawArchive = null,
        this._storage = documentArchiveConfig.getStorageClient()
    }

    /**
     * Loads a read-only DAR
     * 
     * @param {string} archiveId The id of the read-only DAR to load
     * @returns {Promise} A promise that will be resolved with the read-only DAR or rejected with errors that occured during the loading process 
     */
    load(archiveId) {
        let self = this

        return new Promise(function(resolve, reject) {
            self._storage.read(archiveId)
                .then(function(rawArchive) {
                    self.setArchiveId(archiveId)
                    self.setRawArchive(rawArchive)
                    self._manifestLoader = new ManifestLoader()
                    return self._manifestLoader.load( rawArchive.resources['manifest.xml'] )
                })
                .then(function(manifest) {
                    self.setManifest(manifest)
                    let documentLoader = new DocumentLoader()
                    return documentLoader.load( self.getRawDocuments() )
                })
                .then(function(documents) {
                   self.setDocuments(documents)
                   resolve(self)
                })
                .catch(function(errors) {
                    reject(errors);
                });
        });
    }

    /**
     * Returns the id this read-only DAR
     * 
     * @returns {string} The id of this read-only DAR
     */
    getArchiveId() {
        return this._archiveId
    }

    /**
     * Sets the id this read-only DAR
     * 
     * @param {string} archiveId The id of this read-only DAR
     */
    setArchiveId(archiveId) {
        this._archiveId = archiveId
    }

    /**
     * Gets all documents of this read-only DAR as instances of the TextureArchive class
     * 
     * @returns {Object} All documents of this read-only DAR as instances of the TextureArchive class
     */
    getDocuments() {
        return this._documents;
    }

    /**
     * Sets the documents of this read-only DAR
     * 
     * @param {Object} documents All documents of this read-only DAR as instances of the TextureArchive class
     */
    setDocuments(documents) {
        this._documents = documents
    }

    /**
     * Gets the raw documents of this read-only DAR
     * 
     * @returns {Object} The raw documents of this read-only DAR
     */
    getRawDocuments() {
        let documents = {},
            documentEntries = this.getDocumentEntries(),
            rawArchive = this.getRawArchive()
        
        forEach(documentEntries, function(documentEntry, key) {
            let document = rawArchive.resources[documentEntry.path]

            if (!document) {
                return false
            }

            document.type = documentEntry.type
            documents[documentEntry.id] = document
        })

        return documents
    }

    /**
     * Gets the all document entries contained in the manifest of this read-only DAR 
     * 
     * @returns {Object} All document entries contained in the manifest of this read-only DAR 
     */
    getDocumentEntries() {
        return this._manifest.getDocumentEntries()
    }

    /**
     * Gets a single document entry contained in the manifest of this read-only DAR 
     * 
     * @param {string} id The id of a document entry contained in the manifest of this read-only DAR
     * @returns {Object} A single document entry contained in the manifest of this read-only DAR 
     */
    getDocumentEntry(id) {
        return this._manifest.getDocumentEntry(id)
    }

    /**
     * Gets the manifest of this read-only DAR 
     * 
     * @returns {ManifestDocument} The manifest of this read-only DAR
     */
    getManifest() {
        return this._manifest
    }

    /**
     * Sets the manifest of this read-only DAR 
     * 
     * @param {ManifestDocument} manifest The manifest of this read-only DAR
     */
    setManifest(manifest) {
        this._manifest = manifest
    }

    /**
     * Gets the manifest loader of this read-only DAR 
     * 
     * @returns {Object} The manifest loader of this read-only DAR
     */
    getManifestLoader() {
        return this._manifestLoader
    }

    /**
     * Gets the raw version (as loaded from the server) of this read-only DAR
     * 
     * @returns {Object} The raw version of this read-only DAR
     */
    getRawArchive() {
        return this._rawArchive
    }

    /**
     * Sets the raw version (as loaded from the server) of this read-only DAR
     * 
     * @param {Object} rawArchive The raw version of this read-only DAR 
     */
    setRawArchive(rawArchive) {
        this._rawArchive = rawArchive
    }

    /**
     * Gets the version of the this read-only DAR
     * 
     * @returns {string} The version of this ready-only DAR
     */
    getVersion() {
        return this._getRawArchive().version
    }
}