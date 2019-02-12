import { forEach, last, uuid, EventEmitter, platform, isString } from 'substance'
import { throwMethodIsAbstract } from '../kit/shared'
import ManifestLoader from './ManifestLoader'

/*
  A PersistedDocumentArchive is a 3-tier stack representing a document archive
  at different application levels:

  1. Editor: an application such as Texture works on an in-memory data model,
     managed by EditorSessions. There may be multiple sessions for different parts of the
     document archive, e.g. the manuscript and an entity db.
  2. Buffer: a short-term storage for pending changes. Until the document archive
     is saved permanently, changes are recorded and can be persisted, e.g. to
     avoid loosing changes when the browser is closed inadvertently.
  3. Storage: a long-term storage where the document archive is persisted and versioned.

  PersistedDocumentArchive manages the communication between the three layers, e.g.
  when the user changes a document, it records the change and stores it into the buffer,
  and eventually saving a new version of the ardhive.
*/
export default class PersistedDocumentArchive extends EventEmitter {
  constructor (storage, buffer, context, config) {
    super()
    this.storage = storage
    this.buffer = buffer

    this._archiveId = null
    this._upstreamArchive = null
    this._sessions = null
    this._pendingFiles = new Map()
    this._config = config
  }

  addDocument (type, name, xml) {
    let documentId = uuid()
    let sessions = this._sessions
    let session = this._loadDocument(type, { data: xml }, sessions)
    sessions[documentId] = session
    this._registerForSessionChanges(session, documentId)
    this._addDocumentRecord(documentId, type, name, documentId + '.xml')
    return documentId
  }

  addAsset (file) {
    let assetId = uuid()
    let [name, ext] = _getNameAndExtension(file.name)
    let filePath = this._getUniqueFileName(name, ext)
    this._sessions.manifest.transaction(tx => {
      let assets = tx.find('assets')
      let asset = tx.createElement('asset', { id: assetId }).attr({
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
    // FIXME: what to do in NodeJS?
    if (platform.inBrowser) {
      this._pendingFiles.set(filePath, URL.createObjectURL(file))
    }
    return filePath
  }

  getAsset (fileName) {
    return this._sessions.manifest.getDocument().find(`asset[path="${fileName}"]`)
  }

  getDocumentEntries () {
    return this.getEditorSession('manifest').getDocument().getDocumentEntries()
  }

  getDownloadLink (fileName) {
    let manifest = this._sessions.manifest.getDocument()
    let asset = manifest.find(`asset[path="${fileName}"]`)
    if (asset) {
      return this.resolveUrl(fileName)
    }
  }

  getEditorSession (docId) {
    return this._sessions[docId]
  }

  hasAsset (fileName) {
    // TODO: at some point I want to introduce an index for files by fileName/path
    return Boolean(this.getAsset(fileName))
  }

  hasPendingChanges () {
    return this.buffer.hasPendingChanges()
  }

  load (archiveId, cb) {
    const storage = this.storage
    const buffer = this.buffer
    storage.read(archiveId, (err, upstreamArchive) => {
      if (err) return cb(err)
      buffer.load(archiveId, err => {
        if (err) return cb(err)
        // Ensure that the upstream version is compatible with the buffer.
        // The buffer may contain pending changes.
        // In this case the buffer should be based on the same version
        // as the latest version in the storage.
        if (!buffer.hasPendingChanges()) {
          let localVersion = buffer.getVersion()
          let upstreamVersion = upstreamArchive.version
          if (localVersion && upstreamVersion && localVersion !== upstreamVersion) {
            // If the local version is out-of-date, it would be necessary to 'rebase' the
            // local changes.
            console.error('Upstream document has changed. Discarding local changes')
            this.buffer.reset(upstreamVersion)
          } else {
            buffer.reset(upstreamVersion)
          }
        }
        // convert raw archive into sessions (=ingestion)
        let sessions = this._ingest(upstreamArchive)
        // contract: there must be a manifest
        if (!sessions['manifest']) {
          throw new Error('There must be a manifest session.')
        }
        // apply pending changes
        if (!buffer.hasPendingChanges()) {
          // TODO: when we have a persisted buffer we need to apply all pending
          // changes.
          // For now, we always start with a fresh buffer
        } else {
          buffer.reset(upstreamArchive.version)
        }
        // register for any changes in each session
        this._registerForAllChanges(sessions)

        this._archiveId = archiveId
        this._upstreamArchive = upstreamArchive
        this._sessions = sessions

        // Run through a repair step (e.g. remove missing files from archive)
        this._repair()
        cb(null, this)
      })
    })
  }

  removeDocument (documentId) {
    let session = this._sessions[documentId]
    this._unregisterFromSession(session)
    this._sessions.manifest.transaction(tx => {
      let documents = tx.find('documents')
      let docEntry = tx.find(`#${documentId}`)
      documents.removeChild(docEntry)
    })
  }

  renameDocument (documentId, name) {
    this._sessions.manifest.transaction(tx => {
      let docEntry = tx.find(`#${documentId}`)
      docEntry.attr({ name })
    })
  }

  resolveUrl (path) {
    // until saved, files have a blob URL
    let blobUrl = this._pendingFiles.get(path)
    if (blobUrl) {
      return blobUrl
    } else {
      let fileRecord = this._upstreamArchive.resources[path]
      if (fileRecord && fileRecord.encoding === 'url') {
        return fileRecord.data
      }
    }
  }

  save (cb) {
    // FIXME: buffer.hasPendingChanges() is not working
    this.buffer._isDirty['manuscript'] = true
    this._save(this._archiveId, cb)
  }

  /*
    Save as is implemented as follows.

    1. clone: copy all files from original archive to new archive (backend)
    2. save: perform a regular save using user buffer (over new archive, including pending
       documents and blobs)
  */
  saveAs (newArchiveId, cb) {
    this.storage.clone(this._archiveId, newArchiveId, (err) => {
      if (err) return cb(err)
      this._save(newArchiveId, cb)
    })
  }

  /*
    Adds a document record to the manifest file
  */
  _addDocumentRecord (documentId, type, name, path) {
    this._sessions.manifest.transaction(tx => {
      let documents = tx.find('documents')
      let docEntry = tx.createElement('document', { id: documentId }).attr({
        name: name,
        path: path,
        type: type
      })
      documents.appendChild(docEntry)
    })
  }

  _getUniqueFileName (name, ext) {
    let candidate
    // first try the canonical one
    candidate = `${name}.${ext}`
    if (this.hasAsset(candidate)) {
      let count = 2
      // now use a suffix counting up
      while (true) {
        candidate = `${name}_${count++}.${ext}`
        if (!this.hasAsset(candidate)) break
      }
    }

    return candidate
  }

  _loadManifest (record) {
    if (!record) {
      throw new Error('manifest.xml is missing')
    }
    return ManifestLoader.load(record.data)
  }

  _registerForAllChanges (sessions) {
    forEach(sessions, (session, docId) => {
      this._registerForSessionChanges(session, docId)
    })
  }

  _registerForSessionChanges (session, docId) {
    session.on('change', (change) => {
      this.buffer.addChange(docId, change)
      // Apps can subscribe to this (e.g. to show there's pending changes)
      this.emit('archive:changed')
    }, this)
  }

  _repair () {
    // no-op
  }

  /*
    Create a raw archive for upload from the changed resources.
  */
  _save (archiveId, cb) {
    const buffer = this.buffer
    const storage = this.storage
    const sessions = this._sessions

    let rawArchive = this._exportChanges(sessions, buffer)

    // CHALLENGE: we either need to lock the buffer, so that
    // new changes are interfering with ongoing sync
    // or we need something pretty smart caching changes until the
    // sync has succeeded or failed, e.g. we could use a second buffer in the meantime
    // probably a fast first-level buffer (in-mem) is necessary anyways, even in conjunction with
    // a slower persisted buffer
    storage.write(archiveId, rawArchive, (err, res) => {
      // TODO: this need to implemented in a more robust fashion
      // i.e. we should only reset the buffer if storage.write was successful
      if (err) return cb(err)

      // TODO: if successful we should receive the new version as response
      // and then we can reset the buffer
      let _res = { version: '0' }
      if (isString(res)) {
        try {
          _res = JSON.parse(res)
        } catch (err) {
          console.error('Invalid response from storage.write()')
        }
      }
      // console.log('Saved. New version:', res.version)
      buffer.reset(_res.version)
      // revoking object urls
      if (platform.inBrowser) {
        for (let blobUrl of this._pendingFiles.values()) {
          window.URL.revokeObjectURL(blobUrl)
        }
      }
      this._pendingFiles.clear()

      // After successful save the archiveId may have changed (save as use case)
      this._archiveId = archiveId
      this.emit('archive:saved')
      cb()
    })
  }

  _unregisterFromSession (session) {
    session.off(this)
  }

  /*
    Uses the current state of the buffer to generate a rawArchive object
    containing all changed documents
  */
  _exportChanges (sessions, buffer) {
    let rawArchive = {
      version: buffer.getVersion(),
      diff: buffer.getChanges(),
      resources: {}
    }
    this._exportManifest(sessions, buffer, rawArchive)
    this._exportChangedDocuments(sessions, buffer, rawArchive)
    this._exportChangedAssets(sessions, buffer, rawArchive)
    return rawArchive
  }

  // TODO: generalize the implementation so that it can live here
  _exportChangedDocuments (sessions, buffer, rawArchive) {
    throwMethodIsAbstract()
  }

  _exportChangedAssets (sessions, buffer, rawArchive) {
    let manifest = sessions.manifest.getDocument()
    let assetNodes = manifest.getAssetNodes()
    assetNodes.forEach(asset => {
      let assetId = asset.id
      if (buffer.hasBlobChanged(assetId)) {
        let path = asset.attr('path') || assetId
        let blobRecord = buffer.getBlob(assetId)
        rawArchive.resources[path] = {
          assetId,
          data: blobRecord.blob,
          encoding: 'blob',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      }
    })
  }
}

function _getNameAndExtension (name) {
  let frags = name.split('.')
  let ext = ''
  if (frags.length > 1) {
    ext = last(frags)
    name = frags.slice(0, frags.length - 1).join('.')
  }
  return [name, ext]
}
