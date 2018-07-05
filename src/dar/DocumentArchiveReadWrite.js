import { forEach, last, uuid } from "substance"

import DocumentArchiveBufferSynchronizer from "./DocumentArchiveBufferSynchronizer"
import DocumentArchiveReadWriteExporter from "./DocumentArchiveReadWriteExporter"
import DocumentArchiveReadOnly from "./DocumentArchiveReadOnly";
import EditorSessionGenerator from "../sessions/EditorSessionsGenerator"

/** 
 * @module dar/DocumentArchiveReadWrite
 * 
 * @description
 * A read-write DAR which contains the write-related functionality 
 * of the PersistedDocumentArchive. The necessary read-related functionality
 * is inherited from the DocumentArchiveReadOnly base class. 
 * 
 * It is intended to be used for the usage within application 
 * which have to modify DARs (usually an editor).
 * 
 * Together with the functionality of the DocumentArchiveReadOnly base class
 * this is a 3-tier stack representing a document archive at different application levels:
 * 
 * 1. Editor: an application such as Texture works on an in-memory data model,
 *    managed by EditorSessions. There may be multiple sessions for different parts of the
 *    document archive, e.g. the manuscript and an entity db.
 * 2. Buffer: a short-term storage for pending changes. Until the document archive
 *    is saved permanently, changes are recorded and can be persisted, e.g. to
 *    avoid loosing changes when the browser is closed inadvertently.
 * 3. Storage: a long-term storage where the document archive is persisted and versioned.
 * 
 * The DAR - with the help of external service classes - manages the communication 
 * between the three layers, e.g. when the user changes a document, it records the change 
 * and stores it into the buffer, and eventually saving a new version of the archive.
*/
export default class DocumentArchiveReadWrite extends DocumentArchiveReadOnly {

    constructor(documentArchiveConfig) {
        super(documentArchiveConfig)
        this.buffer = documentArchiveConfig.getBuffer()
    }

    async addDocument(type, name, rawDocument) {
        let documentId = uuid()

        let session = await EditorSessionGenerator.generateSessionForNewDocument(this, rawDocument)
        this._sessions[documentId] = session
        
        this._registerForSessionChanges(session, documentId)
        
        this._sessions["manifest"].transaction(tx => {
            let documents = tx.find('documents')
            let docEntry = tx.createElement('document', {
                id: documentId
            }).attr({
                name: name,
                path: documentId + '.xml',
                type: type
            })
            documents.appendChild(docEntry)
        })

        return documentId
    }

    createFile(file) {
        let assetId = uuid()
        let fileExtension = last(file.name.split('.'))
        let filePath = `${assetId}.${fileExtension}`
        
        this._sessions["manifest"].transaction(tx => {
            let assets = tx.find('assets')
            let asset = tx.createElement('asset', {
                id: assetId
            }).attr({
                path: filePath,
                type: file.type
            })
            assets.appendChild(asset)
        })

        this.buffer.addBlob(assetId, {
            id: assetId,
            path: filePath,
            blob: file
        })

        this._pendingFiles[filePath] = URL.createObjectURL(file)

        return filePath
    }

    /**
     * Exports this DAR
     * 
     * @returns {Object} The exported DAR in different format/representation
     */
    export() {
        return DocumentArchiveReadWriteExporter.export(this)
    }

    hasPendingChanges() {
        return this.buffer.hasPendingChanges()
    }

    /**
     * Loads a DAR
     * 
     * @param {string} archiveId The id of the  DAR to load
     * @returns {Promise} A promise that will be resolved with the DAR or rejected with errors that occured during the loading process 
     */
    load(archiveId) {
        let self = this,
            readOnlyArchiveLoad = super.load(archiveId)

        return new Promise(function (resolve, reject) {
            readOnlyArchiveLoad
                .then(function() {
                    return self.buffer.load()
                })
                .then(function() {
                    // TODO can I apply the buffer snychronization after the 
                    // loading and sessions creation?
                    return DocumentArchiveBufferSynchronizer.synchronize(self)
                })
                .then(function(synchronizedBuffer) {
                    // TODO find out what is the applyPendingChanges method doing - is it necessary?
                    self.buffer = synchronizedBuffer 
                    return DocumentArchiveBufferSynchronizer.applyPendingChanges(self)
                })
                .then(function(synchronizedBuffer) {
                    self.buffer = synchronizedBuffer
                    return self._repair()
                })
                .then(function() {
                    self._registerForAllChanges(self._sessions)
                    resolve(self)
                })
                .catch(function (errors) {
                    reject(errors)
                })
        })
    }

    removeDocument(documentId) {
        let session = this._sessions[documentId]
        this._unregisterFromSession(session)
        
        this._sessions["manifest"].transaction(tx => {
            let documents = tx.find('documents')
            let docEntry = tx.find(`#${documentId}`)
            documents.removeChild(docEntry)
        })
    }

    renameDocument(documentId, name) {
        this._sessions["manifest"].transaction(tx => {
            let docEntry = tx.find(`#${documentId}`)
            docEntry.attr({
                name
            })
        })
    }

    /**
     * Saves a raw representation of this DAR 
     * 
     * @description
     * The raw representation of thie DAR is saved via this DAR's associated
     * storage client 
     * 
     * @param {string} archiveId The id of the archive to save
     * @returns {Promise} A promise that will be resolved with the JSONified raw version of the 
     * saved DAR or rejected with errors that occured during the saving process
     */
    save() {
        if (!this.buffer.hasPendingChanges()) {
            console.info('Save: no pending changes.')
            return Promise.resolve()
        }

        let readOnlyArchiveSave = super.save(), 
            self = this

        return new Promise(function(resolve, reject) {
            readOnlyArchiveSave
                .then(function(result) {
                    self.buffer.reset(result.version)
                    resolve(result)
                })
                .catch(function(errors) {
                    console.error('Saving failed.', errors)
                    reject(errors)
                })
        })
    }

    /**
     * Saves a raw representation of this DAR under a new id
     * 
     * @param {string} newArchiveId The new id under which the DAR should be saved
     * @returns {Promise} A promise that will be resolved with the JSONified raw version of the 
     * saved DAR or rejected with errors that occured during the saving process
     */
    saveAs(newArchiveId) {
        let readOnlyArchiveSaveAs = super.saveAs(newArchiveId), 
            self = this

        return new Promise(function(resolve, reject) {
            readOnlyArchiveSaveAs
                .then(function(result) {
                    self.buffer.reset(result.version)
                    resolve(result)
                })
                .catch(function(errors) {
                    console.error('Saving failed.', errors)
                    reject(errors)
                })
        })
    }

    getBuffer() {
        return this.buffer
    }

    _registerForAllChanges(sessions) {
        let self = this
        forEach(sessions, function(session, docId) {
            self._registerForSessionChanges(session, docId)
        })
    }

    _registerForSessionChanges(session, docId) {
        session.onUpdate("document", function (change) {
            this.buffer.addChange(docId, change)
            // Apps can subscribe to this (e.g. to show there's pending changes)
            this.emit("archive:changed")
        }, this)
    }

    _unregisterFromSession(session) {
        session.off(this)
    }
}