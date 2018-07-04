import { forEach, last, uuid } from "substance"
import DocumentArchiveBufferSynchronizer from "./DocumentArchiveBufferSynchronizer"
import DocumentArchiveReadWriteExporter from "./DocumentArchiveReadWriteExporter"
import DocumentArchiveReadOnly from "./DocumentArchiveReadOnly";
import EditorSessionGenerator from "../editor/util/EditorSessionsGenerator"

export default class DocumentArchiveReadWrite extends DocumentArchiveReadOnly {

    constructor(documentArchiveConfig) {
        super(documentArchiveConfig)
        this.buffer = documentArchiveConfig.getBuffer()
        this._bufferSynchronizer = null
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
     * Exports this read-only DAR
     */
    export() {
        return DocumentArchiveReadWriteExporter.export(this)
    }

    hasPendingChanges() {
        return this.buffer.hasPendingChanges()
    }

    load(archiveId) {
        let self = this,
            readOnlyArchiveLoad = super.load(archiveId)

        return new Promise(function (resolve, reject) {
            readOnlyArchiveLoad
                .then(function() {
                    return self.buffer.load()
                })
                .then(function() {
                    // TODO can I apply the buffer snychronization after the loading and sessions creation?
                    self._bufferSynchronizer = new DocumentArchiveBufferSynchronizer()
                    return self._bufferSynchronizer.synchronize(self.buffer, self._upstreamArchive)
                })
                .then(function(synchronizedBuffer) {
                    // TODO what is the applyPendingChanges method doing - is it necessary?
                    self.buffer = synchronizedBuffer 
                    return self._bufferSynchronizer.applyPendingChanges(self.buffer, self._upstreamArchive)
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