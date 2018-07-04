import { EventEmitter, forEach } from "substance"

import DocumentArchiveReadOnlyExporter from "./DocumentArchiveReadOnlyExporter"
import EditorSessionsGenerator from "../editor/util/EditorSessionsGenerator"
import EditorSessionsValidator from "../editor/util/EditorSessionsValidator"

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

        /**
         * TODO can we do this._articleConfig = documentArchiveConfig.getArticleConfig()
         */
        this._config = {
            ArticleConfig: documentArchiveConfig.getArticleConfig()
        }

        this._context = documentArchiveConfig.getContext() // TODO is this necessary here?
        this._pendingFiles = {}
        this._sessions = {}
        this._storage = documentArchiveConfig.getStorageClient()
        this._storageConfig = documentArchiveConfig.getStorageConfig()
        this._upstreamArchive = null
    }

    /**
     * Exports this read-only DAR
     */
    export() {
        return DocumentArchiveReadOnlyExporter.export(this)
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
     * TODO can we rename this to getArticleConfig()?
     * 
     * Returns the configuration of this DAR 
     * @return {Object} The configuration of this DAR
     */
    getConfig() {
        return this._config
    }

    /**
     * Gets the all document entries contained in the manifest of this read-only DAR 
     * 
     * @returns {Object} All document entries contained in the manifest of this read-only DAR 
     */
    getDocumentEntries() {
        return this.getManifest().getDocumentEntries()
    }

    /**
     * Gets a single document entry contained in the manifest of this read-only DAR 
     * 
     * @param {string} id The id of a document entry contained in the manifest of this read-only DAR
     * @returns {Object} A single document entry contained in the manifest of this read-only DAR 
     */
    getDocumentEntry(id) {
        return this.getManifest().getDocumentEntry(id)
    }

    /**
     * Gets the manifest of this read-only DAR
     * 
     * @returns {ManifestDocument} The manifest of this read-only DAR
     */
    getManifest() {
        return this.getManifestSession().getDocument()
    }

    /**
     * Gets the manifest session of this read-only DAR
     * 
     * @returns {ManifestDocument} The manifest session of this read-only DAR
     */
    getManifestSession() {
        return this._sessions["manifest"]
    }

    /**
     * Gets the raw documents of this read-only DAR
     * 
     * @returns {Object} The raw documents of this read-only DAR
     */
    getRawDocuments() {
        let documents = {},
            documentEntries = this.getDocumentEntries(),
            upstreamArchive = this.getUpstreamArchive()
        
        forEach(documentEntries, function(documentEntry, key) {
            let document = upstreamArchive.resources[documentEntry.path]

            if (!document) {
                return false
            }

            document.type = documentEntry.type
            documents[documentEntry.id] = document
        })

        return documents
    }

    /**
     * Gets the version of the this read-only DAR
     * 
     * @returns {string} The version of this ready-only DAR
     */
    getVersion() {
        return this._upstreamArchive.version
    }

    /**
     * Gets the raw version (as loaded from the server) of this read-only DAR
     * 
     * @returns {Object} The raw version of this read-only DAR
     */
    getUpstreamArchive() {
        return this._upstreamArchive
    }

    /**
     * Sets the raw version (as loaded from the server) of this read-only DAR
     * 
     * @param {Object} upstreamArchive The raw version of this read-only DAR
     */
    setUpstreamArchive(upstreamArchive) {
        this._upstreamArchive = upstreamArchive
    }

    /**
     * TODO can this be renamed to getSession()?
     * 
     * Returns a single session of this DAR
     * 
     * @param {string} sessionId The id of the session
     * @returns {Object} A single session of this DAR
     */
    getEditorSession(sessionId) {
        return this._sessions[sessionId]
    }

    /**
     * Returns a single session of this DAR
     * 
     * @param {string} sessionId The id of the session
     * @returns {Object} A single session of this DAR
     */
    getSession(sessionId) {
        return this._sessions[sessionId]
    }

    /**
     * Sets a single session of this DAR
     * 
     * @param {string} sessionId The id of the session
     * @param {Object} session The session to set
     */
    setSession(sessionId, session) {
        this._sessions[sessionId] = session
    }

    /**
     * TODO can this be deleted in favour of getSessions()?
     * 
     * Returns all session of this DAR
     * 
     * @returns {Object} All sessions of this DAR
     */
    getEditorSessions() {
        return this._sessions
    }

    /**
     * Returns all session of this DAR
     * 
     * @returns {Object} All sessions of this DAR
     */
    getSessions() {
        return this._sessions
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
                .then(function(upstreamArchive) {
                    self._archiveId = archiveId
                    self._upstreamArchive = upstreamArchive
                    return Promise.all([
                        EditorSessionsGenerator.generateSessionForManifest(self),
                        EditorSessionsGenerator.generateSessionForPubMeta(self)
                    ])
                })
                .then(function(sessions) {
                    self._sessions["manifest"] = sessions[0]
                    self._sessions["pub-meta"] = sessions[1]    
                    return EditorSessionsGenerator.generateSessionsForExistingDocuments(self)
                })
                .then(function(documentSessions) {
                    self._sessions = Object.assign(self._sessions, documentSessions)
                    let editorSessionsValidator = new EditorSessionsValidator()
                    return editorSessionsValidator.areSessionsValid(self._sessions)
                })
                .then(function(validationResult) {
                    if (!validationResult.ok) {
                        reject(validationResult.errors)
                    }
                    
                    resolve(self)
                })
                .catch(function(errors) {
                    reject(errors);
                });
        });
    }

    /**
     * TODO what is this function doing?
     * 
     * @param {string} path 
     */
    resolveUrl(path) {
        let blobUrl = this._pendingFiles[path]
        if (blobUrl) {
            return blobUrl
        } else {
            let fileRecord = this._upstreamArchive.resources[path]
            if (fileRecord && fileRecord.encoding === 'url') {
                return fileRecord.data
            }
        }
    }

    /*
     * Create a raw archive for upload from the changed resources.
     */
    save(archiveId) {
        let self = this

        return new Promise(function(resolve, reject) {
            self.export(self)
                .then(function(rawArchive) {
                    // CHALLENGE: we either need to lock the buffer, so that
                    // new changes are interfering with ongoing sync
                    // or we need something pretty smart caching changes until the
                    // sync has succeeded or failed, e.g. we could use a second buffer in the meantime
                    // probably a fast first-level buffer (in-mem) is necessary anyways, even in conjunction with
                    // a slower persisted buffer
                    return self._storage.write((archiveId || self._archiveId), rawArchive)
                })
                .then(function(res) {
                    // TODO: if successful we should receive the new version as response
                    // and then we can reset the buffer
                    res = JSON.parse(res)
                    
                    // console.log('Saved. New version:', res.version)
                    
                    // After successful save the archiveId may have changed (save as use case)
                    self._archiveId = archiveId
                    
                    resolve(res) 
                }).catch(function(errors) {
                    console.error('Saving failed.', errors)
                    reject(errors)
                })
        })
        
    }

    /**
     * Save as is implemented as follows.
     *
     * 1. clone: copy all files from original archive to new archive (backend)
     * 2. save: perform a regular save using user buffer (over new archive, including pending
     * documents and blobs)
     */
    saveAs(newArchiveId) {
        return this._storage.clone(this._archiveId, newArchiveId).then(function() {
            return this.save(newArchiveId)
        })
    }
}