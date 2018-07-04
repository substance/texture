import { prettyPrintXML } from 'substance'
import { JATSExporter } from './article'
import DocumentArchiveReadWrite from './dar/DocumentArchiveReadWrite'
import StorageTypes from "./dar/StorageTypes"
import vfsSaveHook from "./util/vfsSaveHook"

export default class TextureArchive extends DocumentArchiveReadWrite {

  constructor(documentArchiveConfig) {
    super(documentArchiveConfig)
    this._checkStorage()
  }

  load(archiveId) {
    let self = this,
        readWriteArchiveLoad = super.load(archiveId)

    return new Promise(function (resolve, reject) {
      readWriteArchiveLoad
        .then(function(archive) {
          self = archive
          console.log(self)
          //self._repair()
          resolve(self)
        })
    })
  }

  _checkStorage() {
    if (this._storageConfig.getId() === StorageTypes.VFS ) {
        vfsSaveHook(this._storage, TextureArchive)
    }
  } 

  _repair() {
    let manifestSession = this.getEditorSession('manifest')
    let entries = manifestSession.getDocument().getDocumentEntries()
    let missingEntries = []

    entries.forEach(entry => {
      let session = this.getEditorSession(entry.id)
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
  The serialised manifest should have no pub-meta document entry, so we
  remove it here.
*/
function _exportManifest(manifestDom) {
  let documents = manifestDom.find('documents')
  let pubMetaEl = documents.find('document#pub-meta')
  documents.removeChild(pubMetaEl)
  return manifestDom
}
