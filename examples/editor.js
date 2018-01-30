import {
  getQueryStringParam, DocumentArchive, ManifestLoader,
} from 'substance'
import { ArticleLoader, PubMetaLoader, Texture, JATSImportDialog } from 'substance-texture'


class DarLoader {

  load(rawArchive) {
    let sessions
    if (rawArchive['pub-meta.json']) {
      sessions = {
        'manifest': ManifestLoader.load(rawArchive['manifest.xml'].data),
        'manuscript': ArticleLoader.load(rawArchive['manuscript.xml'].data),
        'pub-meta': PubMetaLoader.load(rawArchive['pub-meta.json'].data),
      }
    } else {
      // Injestion: We need to extract pubMetaDb from the manuscript
      let pubMetaSession = PubMetaLoader.load()
      let manuscriptSession = ArticleLoader.load(rawArchive['manuscript.xml'].data, {
        pubMetaDb: pubMetaSession.getDocument()
      })
      sessions = {
        'manifest': ManifestLoader.load(rawArchive['manifest.xml'].data),
        'manuscript': manuscriptSession,
        'pub-meta': pubMetaSession
      }
    }
    return new DocumentArchive(sessions)
  }
}

window.addEventListener('load', () => {
  const vfs = window.vfs
  let archivePath = getQueryStringParam('archive')
  let rawArchive = _readRawArchive(vfs, archivePath)

  try {
    let loader = new DarLoader()
    let archive = loader.load(rawArchive)
    Texture.mount({ archive }, window.document.body)
  } catch(err) {
    console.error(err)
    if (err.type === 'jats-import-error') {
      JATSImportDialog.mount({ errors: err.detail }, window.document.body)
    } else {
      window.document.body.innerHTML = err.message
    }
  }
})


function _readRawArchive(fs, darUrl) {
  let manifestXML = fs.readFileSync(`${darUrl}/manifest.xml`)
  let manifestSession = ManifestLoader.load(manifestXML)
  let manifest = manifestSession.getDocument()
  let docs = manifest.findAll('documents > document')
  let assets = manifest.findAll('assets > asset')
  let rawArchive = {
    'manifest.xml': {
      type: 'application/dar-manifest',
      data: manifestXML
    }
  }

  docs.forEach(entry => {
    let path = entry.attr('path')
    let type = entry.attr('type')
    let content = fs.readFileSync(`${darUrl}/${entry.path}`)
    rawArchive[path] = {
      type: type,
      data: content
    }
  })

  assets.forEach(asset => {
    let path = asset.attr('path')
    rawArchive[path] = {
      type: 'image/jpg',
      url: path
    }
  })
  return rawArchive
}
