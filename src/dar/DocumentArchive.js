/**
 * TODO Find out if this is used somewhere or if
 * this can be deleted?
 *
 * OB: this class is used as a root container for the in-memory representation of a DAR
 * It provides access to the manifest document, and sessions for documents.
 * Note: we are about to remove the need of having 'EditorSessions' at this point
 * Instead we should establish something like 'DocumentSessions' here,
 * just with the ability to start low-level transactions.
 * Further down the application, there will be something like an Editor.
 */
export default class DocumentArchive {

  constructor(sessions, buffer) {
    this.sessions = sessions
    this.buffer = buffer

    if (!sessions.manifest) throw new Error("'manifest' session is required.")

    this.init()
  }

  init() {
    // register listeners for every session

  }

  getManifest() {
    return this.sessions.manifest.getDocument()
  }

  getDocumentEntries() {
    return this.getEditorSession('manifest').getDocument().getDocumentEntries()
  }

  // OB: we are moving away from 'Substance.EditorSessions'
  // We need to discuss what a 'session' should actually be here.
  // E.g., it would make sense to have a uniform interface for changes
  // agnostic of the actual document implementation
  // to establish a unified stream of DAR changes.
  // For building and editor for a specific document type, we would not
  // need to be too prescriptive here, as this could be sorted out on a deeper level.
  // Only for collaboration, we would need to have a unfied means to dispatch to the right level.
  getEditorSession(docId) {
    return this.sessions[docId]
  }
}
