import { prettyPrintXML } from 'substance'
import { JATSExporter } from './article'
import DocumentArchiveReadWrite from './dar/DocumentArchiveReadWrite'
import StorageClientTypes from "./dar/StorageClientTypes"
import vfsSaveHook from "./util/vfsSaveHook"

export default class TextureArchive extends DocumentArchiveReadWrite {

  constructor(documentArchiveConfig) {
    super(documentArchiveConfig)
    this._checkStorage(documentArchiveConfig)
  }

  load(archiveId) {
    let self = this,
        readWriteArchiveLoad = super.load(archiveId)

    return new Promise(function (resolve, reject) {
      readWriteArchiveLoad
        .then(function(archive) {
          self = archive
          console.log(archive)
          window.archive = archive
          //self._repair()
          resolve(self)
        })
    })
  }

  _checkStorage(documentArchiveConfig) {
    if (this._storageConfig.getId() === StorageClientTypes.VFS ) {
        vfsSaveHook(this._storage, TextureArchive, documentArchiveConfig)
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

  getTitle() {
    let editorSession = this._session['manuscript']
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