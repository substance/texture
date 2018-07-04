import {forEach} from "substance"
import DocumentArchiveBufferSynchronizer from "./DocumentArchiveBufferSynchronizer"
import DocumentArchiveReadOnly from "./DocumentArchiveReadOnly";

export default class DocumentArchiveReadWrite extends DocumentArchiveReadOnly {
    constructor(documentArchiveConfig) {
        super(documentArchiveConfig)
        this.buffer = documentArchiveConfig.getBuffer()
        this._bufferSynchronizer = null
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
}