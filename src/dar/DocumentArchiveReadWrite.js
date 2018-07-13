import { forEach, last, uuid } from "substance"

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
  export () {
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
    let self = this, readOnlyArchiveLoad = super.load(archiveId)

    const buffer = this.buffer

    return new Promise(function (resolve, reject) {
      readOnlyArchiveLoad
        .then(function() {
          return buffer.load()
        })
        .then(function() {
          /**
           * TODO Completely understand this synch logic and check if the execution 
           * of this logic can happen after the archive has been completely loaded (e.g. after 
           * the sessions have been created)
           */
          if (!buffer.hasPendingChanges()) {
            let localVersion = buffer.getVersion()
            let upstreamVersion = self._upstreamArchive.version
            if (localVersion && upstreamVersion && localVersion !== upstreamVersion) {
              // If the local version is out-of-date, it would be necessary to 'rebase' the
              // local changes.
              console.error('Upstream document has changed. Discarding local changes')
              self.buffer.reset(upstreamVersion)
            } else {
              buffer.reset(upstreamVersion)
            }
          }
          return null
        })
        .then(function() {
          /**
           * TODO Completely understand this synch logic and check if the execution 
           * of this logic can happen after the archive has been completely loaded (e.g. after 
           * the sessions have been created)
           */
          if (!buffer.hasPendingChanges()) {
            // TODO: when we have a persisted buffer we need to apply all pending
            // changes.
            // For now, we always start with a fresh buffer
          } else {
            buffer.reset(self._upstreamArchive.version)
          }

          self._registerForAllChanges(self._sessions)
          return self._repair()
        })
        .then(function(repairedSelf) {
          resolve(repairedSelf)
        })
        .catch(function(errors) {
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
   * The raw representation of this DAR is saved via this DAR's associated
   * storage client 
   * 
   * @param {string} archiveId The id of the archive to save
   * @param {boolean} forceSave A flag indicating if the archive should be saved even when there are no pending changes
   * @returns {Promise} A promise that will be resolved with the JSONified raw version of the 
   * saved DAR or rejected with errors that occured during the saving process
   */
  save(archiveId, forceSave) {
    if (!this.buffer.hasPendingChanges() && !forceSave) {
      console.info('Save: no pending changes')
      return Promise.resolve()
    }

    let self = this

    return new Promise(function (resolve, reject) {
      self.export(self)
        .then(function (rawArchive) {
          // CHALLENGE: we either need to lock the buffer, so that
          // new changes are interfering with ongoing sync
          // or we need something pretty smart caching changes until the
          // sync has succeeded or failed, e.g. we could use a second buffer in the meantime
          // probably a fast first-level buffer (in-mem) is necessary anyways, even in conjunction with
          // a slower persisted buffer
          return self._storage.write((archiveId || self._archiveId), rawArchive)
        })
        .then(function (rawArchiveSaved) {
          self.buffer.reset(rawArchiveSaved.version)
          resolve(rawArchiveSaved)
        })
        .catch(function (errors) {
          console.error('Saving failed.', errors)
          reject(errors)
        })
    })
  }

  /**
   * Saves a raw representation of this DAR under a new id
   * 
   * @description
   * This feature is implemented as follows:
   * 1. clone: copy all files from original archive to new archive (backend)
   * 2. save: perform a regular save using user buffer (over new archive, including pending
   * documents and blobs) 
   * 
   * @param {string} newArchiveId The new id under which the DAR should be saved
   * @returns {Promise} A promise that will be resolved with the JSONified raw version of the 
   * saved DAR or rejected with errors that occured during the saving process
   */
  saveAs(newArchiveId) {
    let self = this

    return new Promise(function (resolve, reject) {
      self._storage.clone(self._archiveId, newArchiveId)
        .then(function () {
          return self.save(newArchiveId, true)
        })
        .then(function (rawArchiveSaved) {
          self._archiveId = newArchiveId
          resolve(rawArchiveSaved)
        })
        .catch(function (errors) {
          reject(errors)
        })
    })
  }

  /**
   * Returns the buffer of this DAR
   * 
   * @returns {string} The buffer of this DAR
   */
  getBuffer() {
    return this.buffer
  }

  _registerForAllChanges(sessions) {
    let self = this
    forEach(sessions, function (session, docId) {
      self._registerForSessionChanges(session, docId)
    })
  }

  _registerForSessionChanges(session, docId) {
    let self = this

    session.onUpdate("document", function(change) {
      self.buffer.addChange(docId, change)
      // Apps can subscribe to this (e.g. to show there's pending changes)
      self.emit("archive:changed")
    }, self)
  }

  /**
   * Repairs the DAR 
   * 
   * @description
   * Runs a series of repair steps such as removing missing files from archive
   */
  _repair() {
    let self = this

    return new Promise(function (resolve, reject) {
      try {
        let manifestSession = self._sessions["manifest"]
        let entries = manifestSession.getDocument().getDocumentEntries()
        let missingEntries = []

        entries.forEach(entry => {
          let session = self._sessions[entry.id]
          if (!session) {
            missingEntries.push(entry.id)
            console.warn(`${entry.path} could not be found in archive and will be deleted...`)
          }
        })

        // Cleanup missing entries
        manifestSession.transaction(tx => {
          let documentsEl = tx.find('documents')
          missingEntries.forEach(missingEntry => {
            let entryEl = tx.get(missingEntry)
            documentsEl.removeChild(entryEl)
          })
        })

        resolve(self)
      } catch (errors) {
        reject(errors)
      }
    })
  }

  _unregisterFromSession(session) {
    session.off(this)
  }
}