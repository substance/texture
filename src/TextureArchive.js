import { DefaultDOMElement } from 'substance'
import { PersistedDocumentArchive } from './dar'

export default class TextureArchive extends PersistedDocumentArchive {
  /*
    Creates EditorSessions from a raw archive.
    This might involve some consolidation and ingestion.
  */
  _ingest (rawArchive) {
    let documents = {}
    let manifestXML = _importManifest(rawArchive)
    let manifest = this._loadManifest({ data: manifestXML })
    documents['manifest'] = manifest
    let entries = manifest.getDocumentEntries()

    entries.forEach(entry => {
      let record = rawArchive.resources[entry.path]
      // Note: this happens when a resource is referenced in the manifest
      // but is not there actually
      // we skip loading here and will fix the manuscript later on
      if (!record) {
        return
      }
      // TODO: we need better concept for handling errors
      let document = this._loadDocument(entry.type, record, documents)
      documents[entry.id] = document
    })
    return documents
  }

  // TODO: this should be generalized and then live in the base class
  _exportChangedDocuments (documents, buffer, rawArchive) {
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
        let document = documents[id]
        // TODO: how should we communicate file renamings?
        rawArchive.resources[path] = {
          id,
          data: this._exportDocument(type, document, documents),
          encoding: 'utf8',
          updatedAt: Date.now()
        }
      }
    }
  }

  _loadDocument (type, record, documents) {
    let loader = this._config.getDocumentLoader(type)
    if (loader) {
      return loader.load(record.data, this._config)
    } else {
      throw new Error('Unsupported document type')
    }
  }

  _exportDocument (type, document, documents) { // eslint-disable-line no-unused-vars
    let serializer = this._config.getDocumentSerializer(type)
    if (serializer) {
      return serializer.export(document, this._config)
    } else {
      throw new Error('Unsupported document type')
    }
  }

  getTitle () {
    // TODO: the name of the 'main' document should not be hard-coded
    let mainDocument = this.getDocument('manuscript')
    let title = 'Untitled'
    if (mainDocument) {
      let articleTitle = mainDocument.getTitle()
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
