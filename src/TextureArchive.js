import { prettyPrintXML, DefaultDOMElement } from 'substance'
import { PersistedDocumentArchive } from './dar'

export default class TextureArchive extends PersistedDocumentArchive {
  /*
    Creates EditorSessions from a raw archive.
    This might involve some consolidation and ingestion.
  */
  _ingest (rawArchive) {
    let sessions = {}
    let manifestXML = _importManifest(rawArchive)
    let manifestSession = this._loadManifest({ data: manifestXML })
    sessions['manifest'] = manifestSession
    let entries = manifestSession.getDocument().getDocumentEntries()

    entries.forEach(entry => {
      let record = rawArchive.resources[entry.path]
      // Note: this happens when a resource is referenced in the manifest
      // but is not there actually
      // we skip loading here and will fix the manuscript later on
      if (!record) {
        return
      }
      // TODO: we need better concept for handling errors
      // Passing down 'sessions' so that we can add to the pub-meta session
      let session = this._loadDocument(entry.type, record, sessions)
      sessions[entry.id] = session
    })
    return sessions
  }

  _exportManifest (sessions, buffer, rawArchive) {
    let manifest = sessions.manifest.getDocument()
    if (buffer.hasResourceChanged('manifest')) {
      let manifestDom = manifest.toXML()
      let manifestXmlStr = prettyPrintXML(manifestDom)
      rawArchive.resources['manifest.xml'] = {
        id: 'manifest',
        data: manifestXmlStr,
        encoding: 'utf8',
        updatedAt: Date.now()
      }
    }
  }

  // TODO: this should be generalized and then live in the base class
  _exportChangedDocuments (sessions, buffer, rawArchive) {
    // Note: we are only adding resources that have changed
    // and only those which are registered in the manifest
    let entries = this.getDocumentEntries()
    for (let entry of entries) {
      let { id, type, path } = entry
      const hasChanged = buffer.hasResourceChanged(id)
      // skipping unchanged resources
      if (!hasChanged) continue
      // We mark a resource dirty when it has changes, or if it is an article
      // and pub-meta has changed
      if (type === 'article') {
        let session = sessions[id]
        // TODO: how should we communicate file renamings?
        rawArchive.resources[path] = {
          id,
          // HACK: same as when loading we pass down all sessions so that we can do some hacking there
          data: this._exportDocument(type, session, sessions),
          encoding: 'utf8',
          updatedAt: Date.now()
        }
      }
    }
  }

  _loadDocument (type, record, sessions) {
    let loader = this._config.getDocumentLoader(type)
    if (loader) {
      return loader.load(record.data, this._config)
    } else {
      throw new Error('Unsupported document type')
    }
  }

  _exportDocument (type, session, sessions) { // eslint-disable-line no-unused-vars
    let serializer = this._config.getDocumentSerializer(type)
    if (serializer) {
      return serializer.export(session.getDocument(), this._config)
    } else {
      throw new Error('Unsupported document type')
    }
  }

  getTitle () {
    let editorSession = this.getDocumentSession('manuscript')
    let title = 'Untitled'
    if (editorSession) {
      let doc = editorSession.getDocument()
      let articleTitle = doc.getTitle()
      if (articleTitle) {
        title = articleTitle
      }
    }
    return title
  }
}

/*
  Create an explicit entry for pub-meta.json, which does not
  exist in the serialisation format
*/
function _importManifest (rawArchive) {
  let manifestXML = rawArchive.resources['manifest.xml'].data
  let dom = DefaultDOMElement.parseXML(manifestXML)
  return dom.serialize()
}
