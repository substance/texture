import { forEach, last, uuid } from "substance"
import DocumentArchiveBufferSynchronizer from "./DocumentArchiveBufferSynchronizer"
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
        if ( !this.hasPendingChanges() ) {
            console.info('Save: no pending changes.')
            return Promise.resolve()
        }

        return this._save(this._archiveId)
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
            return this._save(newArchiveId)
        })
    }

    /*
     * Create a raw archive for upload from the changed resources.
     */
    _save(archiveId) {
        let self = this,
            rawArchive = this._exportChanges(self._sessions, self.buffer)

        // CHALLENGE: we either need to lock the buffer, so that
        // new changes are interfering with ongoing sync
        // or we need something pretty smart caching changes until the
        // sync has succeeded or failed, e.g. we could use a second buffer in the meantime
        // probably a fast first-level buffer (in-mem) is necessary anyways, even in conjunction with
        // a slower persisted buffer
        return self._storage.write(archiveId, rawArchive)
            .then(function(res) {
                // TODO: if successful we should receive the new version as response
                // and then we can reset the buffer
                res = JSON.parse(res)
                // console.log('Saved. New version:', res.version)
                self._buffer.reset(res.version)
                // After successful save the archiveId may have changed (save as use case)
                self._archiveId = archiveId
            }).catch(function(errors) {
                console.error('Saving failed.', errors)
            })
    }

    /*
     * Uses the current state of the buffer to generate a rawArchive object
     * containing all changed documents
     */
    _exportChanges(sessions, buffer) {
        let rawArchive = {
            version: buffer.getVersion(),
            diff: buffer.getChanges(),
            resources: {}
        }
        this._exportManifest(sessions, buffer, rawArchive)
        this._exportDocuments(sessions, buffer, rawArchive)
        this._exportAssets(sessions, buffer, rawArchive)
        return rawArchive
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