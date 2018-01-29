import {
  getQueryStringParam, DocumentArchive, ManifestLoader,
} from 'substance'
import { ArticleLoader, PubMetaLoader, Texture } from 'substance-texture'


class DarLoader {

  load(rawArchive) {
    return new Promise(resolve => {
      let sessions
      if (rawArchive['pub-meta.json']) {
        sessions = {
          'manifest': ManifestLoader.load(rawArchive['manifest.xml'].data),
          'manuscript': ArticleLoader.load(rawArchive['manuscript.xml'].data),
          'pub-meta': PubMetaLoader(rawArchive['pub-meta.json']),
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
      let archive = new DocumentArchive(sessions)
      resolve(archive)
    })
  }
}

window.addEventListener('load', () => {
  const vfs = window.vfs
  let archivePath = getQueryStringParam('archive')

  _readRawArchive(vfs, archivePath).then(rawArchive => {
    const loader = new DarLoader()
    loader.load(rawArchive).then(archive => {
      Texture.mount({ archive }, window.document.body)
    })
  })
})


function _readRawArchive(fs, darUrl) {
  return new Promise(resolve => {

    let manifestXML = fs.readFileSync(`${darUrl}/manifest.xml`)
    let manifest = ManifestLoader.load(manifestXML)
    let docs = manifest.manifest.findAll('documents > document')
    let assets = manifest.manifest.findAll('assets > asset')

    let rawArchive = {
      'manifest.xml': {
        type: 'application/manifest',
        data: manifestXML
      }
    }

    docs.forEach(entry => {
      let path = entry.attr('path')
      let type = entry.attr('type')
      let content = fs.readFileSync(`${darUrl}/${entry.path}`)
      rawArchive[path] = {
        type: `application/${type}`,
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

    resolve(rawArchive)
  })
}
