import { EventEmitter, forEach } from "substance"

import DocumentArchiveReadOnlyExporter from "./DocumentArchiveReadOnlyExporter"
import EditorSessionsGenerator from "../sessions/EditorSessionsGenerator"
import EditorSessionsValidator from "../sessions/EditorSessionsValidator"

/**
 * @module dar/DocumentArchiveReadOnly
 *
 * @description
 * A read only DAR which contains a subset of the functionality
 * of the PersistedDocumentArchive. It is intended to be used for the usage
 * within reader application which don't need to modify DARs.
 *
 * During the loading of an archive not only the raw DAR archive will be loaded
 * from storage but also the internal representations of the DAR's manifest (as
 * an instance of ManifestDocument) as well as all the DAR's sessions via the
 * external EditorSessionsGenerator class
 */
export default class DocumentArchiveReadOnly extends EventEmitter {

  constructor(documentArchiveConfig) {
    super()

    this._archiveId = null

    /**
     * TODO
     * Find out if we can we do
     * this._articleConfig = documentArchiveConfig.getArticleConfig()
     *
     * OB: a configuration for 'article' should come from a nested configuration
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
   * Exports this DAR
   *
   * @returns {Object} The exported DAR in different format/representation
   */
  export () {
    return DocumentArchiveReadOnlyExporter.export(this)
  }

  /**
   * Loads a DAR
   *
   * @param {string} archiveId The id of the  DAR to load
   * @returns {Promise} A promise that will be resolved with the DAR or rejected with errors that occured during the loading process
   */
  load(archiveId) {
    return new Promise((resolve, reject) => {
      this._storage.read(archiveId)
        .then(upstreamArchive => {
          this._archiveId = archiveId
          this._upstreamArchive = upstreamArchive
          return Promise.all([
            EditorSessionsGenerator.generateSessionForManifest(this),
            EditorSessionsGenerator.generateSessionForPubMeta(this)
          ])
        })
        .then(sessions => {
          this._sessions["manifest"] = sessions[0]
          this._sessions["pub-meta"] = sessions[1]
          return EditorSessionsGenerator.generateSessionsForExistingDocuments(this)
        })
        .then(documentSessions => {
          this._sessions = Object.assign(this._sessions, documentSessions)
          return EditorSessionsValidator.areSessionsValid(this._sessions)
        })
        .then(validationResult => {
          if (!validationResult.isOk()) {
            reject(validationResult.getErrors())
          }

          resolve(this)
        })
        .catch(errors => {
          reject(errors);
        });
    });
  }

  /**
   * TODO Find out what this function is doing exactly.
   *
   * @param {string} path
   * @returns
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

  /**
   * Returns the id this DAR
   *
   * @returns {string} The id of this DAR
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
   * Gets the all document entries contained in the manifest of this DAR
   *
   * @returns {Object} All document entries contained in the manifest of this DAR
   */
  getDocumentEntries() {
    return this.getManifest().getDocumentEntries()
  }

  /**
   * Gets a single document entry contained in the manifest of this DAR
   *
   * @param {string} id The id of a document entry contained in the manifest of this DAR
   * @returns {Object} A single document entry contained in the manifest of this DAR
   */
  getDocumentEntry(id) {
    return this.getManifest().getDocumentEntry(id)
  }

  /**
   * Gets the manifest of this DAR
   *
   * @returns {ManifestDocument} The manifest of this DAR
   */
  getManifest() {
    return this.getManifestSession().getDocument()
  }

  /**
   * Gets the manifest session of this DAR
   *
   * @returns {ManifestDocument} The manifest session of this DAR
   */
  getManifestSession() {
    return this._sessions["manifest"]
  }

  /**
   * Gets the raw documents of this DAR
   *
   * @returns {Object} The raw documents of this DAR
   */
  getRawDocuments() {
    let documents = {},
      documentEntries = this.getDocumentEntries(),
      upstreamArchive = this.getUpstreamArchive()

    forEach(documentEntries, function (documentEntry, key) {
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
   * Gets the version of the this DAR
   *
   * @returns {string} The version of this ready-only DAR
   */
  getVersion() {
    return this._upstreamArchive.version
  }

  /**
   * Gets the raw version (as loaded from the server) of this DAR
   *
   * @returns {Object} The raw version of this DAR
   */
  getUpstreamArchive() {
    return this._upstreamArchive
  }

  /**
   * Sets the raw version (as loaded from the server) of this DAR
   *
   * @param {Object} upstreamArchive The raw version of this DAR
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

  setSessions(sessions) {
    this._sessions = sessions
  }

  /**
   * TODO Can this be deleted in favour of getSessions()?
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
   * Returns the title of this DAR
   *
   * @return {string} The title of this DAR or 'Untitled' if no title is present
   */
  getTitle() {
    let manuscriptSession = this._sessions['manuscript']

    if (!manuscriptSession) {
      return 'Untitled'
    }

    let title = manuscriptSession.getDocument().find('article-title').textContent

    if (!title) {
      return 'Untitled'
    }

    return title
  }
}