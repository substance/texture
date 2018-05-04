import { prettyPrintXML, PersistedDocumentArchive, DefaultDOMElement } from 'substance'
import ArticleLoader from './ArticleLoader'
import PubMetaLoader from './PubMetaLoader'
import JATSExporter from './converter/JATSExporter'

export default class TextureArchive extends PersistedDocumentArchive {

  /*
    Creates EditorSessions from a raw archive.
    This might involve some consolidation and ingestion.
  */
  _ingest(rawArchive) {
    let sessions = {}
    let manifestXML = _importManifest(rawArchive)
    let manifestSession = this._loadManifest({ data: manifestXML })
    sessions['manifest'] = manifestSession
    let entries = manifestSession.getDocument().getDocumentEntries()

    // Setup empty pubMetaSession for holding the entity database
    let pubMetaSession = PubMetaLoader.load()
    sessions['pub-meta'] = pubMetaSession

    entries.forEach(entry => {
      let record = rawArchive.resources[entry.path]
      // Load any document except pub-meta (which we prepared manually)
      if (entry.type !== 'pub-meta') {
        // Passing down 'sessions' so that we can add to the pub-meta session
        let session = this._loadDocument(entry.type, record, sessions)
        sessions[entry.id] = session
      }
    })
    return sessions
  }

  _exportManifest(sessions, buffer, rawArchive) {
    let manifest = sessions.manifest.getDocument()
    if (buffer.hasResourceChanged('manifest')) {
      let manifestDom = manifest.toXML()
      let manifestXmlStr = prettyPrintXML(_exportManifest(manifestDom))
      rawArchive.resources['manifest.xml'] = {
        id: 'manifest',
        data: manifestXmlStr,
        encoding: 'utf8',
        updatedAt: Date.now()
      }
    }
  }

  _exportDocuments(sessions, buffer, rawArchive) {
    // Note: we are only adding resources that have changed
    // and only those which are registered in the manifest
    let entries = this.getDocumentEntries()
    let hasPubMetaChanged = buffer.hasResourceChanged('pub-meta')
    entries.forEach(entry => {
      let { id, type, path } = entry
      let hasChanged = buffer.hasResourceChanged(id)

      // We will never persist pub-meta
      if (type === 'pub-meta') return

      // We mark a resource dirty when it has changes, or if it is an article
      // and pub-meta has changed
      if (hasChanged || (type === 'article' && hasPubMetaChanged)) {
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
    })
  }

  _loadDocument(type, record, sessions) {
    switch (type) {
      case 'article': {
        return ArticleLoader.load(record.data, {
          pubMetaDb: sessions['pub-meta'].getDocument(),
          archive: this
        })
      }
      default:
        throw new Error('Unsupported document type')
    }
  }

  _exportDocument(type, session, sessions) {
    switch (type) {
      case 'article': {
        let jatsExporter = new JATSExporter()
        let pubMetaDb = sessions['pub-meta'].getDocument()
        let doc = session.getDocument()
        let dom = doc.toXML()
        let res = jatsExporter.export(dom, { pubMetaDb, doc })
        console.info('saving jats', res.dom.getNativeElement())
        let xmlStr = prettyPrintXML(res.dom)
        return xmlStr
      }
      default:
        throw new Error('Unsupported document type')
    }
  }

  getTitle() {
    let editorSession = this.getEditorSession('manuscript')
    let title = 'Untitled'
    if (editorSession) {
      let doc = editorSession.getDocument()
      let articleTitle = doc.find('article-title').textContent
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
function _importManifest(rawArchive) {
  let manifestXML = rawArchive.resources['manifest.xml'].data
  let dom = DefaultDOMElement.parseXML(manifestXML)
  let documentsEl = dom.find('documents')
  let documents = dom.findAll('documents > document')
  // Remove entries from manifest that can not be found in the archive as files
  documents.forEach(doc => {
    let path = doc.attr('path')
    let record = rawArchive.resources[path]
    if (!record) {
      documentsEl.removeChild(doc)
      console.warn(`${path} could not be found in archive. Skipping...`)
    }
  })
  documentsEl.append(
    dom.createElement('document').attr({
      id: 'pub-meta',
      type: 'pub-meta',
      path: 'pub-meta.json'
    })
  )
  return dom.serialize()
}

/*
  The serialised manifest should have no pub-meta document entry, so we
  remove it here.
*/
function _exportManifest(manifestDom) {
  let documents = manifestDom.find('documents')
  let pubMetaEl = documents.find('document#pub-meta')
  documents.removeChild(pubMetaEl)
  return manifestDom
}
