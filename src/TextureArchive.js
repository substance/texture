import { DocumentArchive, ManifestLoader } from 'substance'
import ArticleLoader from './ArticleLoader'
import PubMetaLoader from './PubMetaLoader'
import JATSExporter from './converter/JATSExporter'

export default class TextureArchive extends DocumentArchive {
  constructor(sessions, client) {
    super(sessions)
    this.client = client
  }

  save() {
    let jatsExporter = new JATSExporter()
    let doc = this.sessions.manuscript.getDocument()
    let pubMetaDb = this.sessions['pub-meta'].getDocument()
    let dom = doc.toXML()
    let res = jatsExporter.export(dom, { pubMetaDb, doc })
    // TODO: Export pubMetaDb, binary assets etc.
    // TODO: Write everything to buffer
    // TODO: Error handling
    console.info('saving jats', res.dom.getNativeElement())
    console.info(res.dom.serialize())
    return Promise.resolve()
  }
}

TextureArchive.load = function(archiveId, client) {
  return new Promise((resolve, reject) => {
    client.read(archiveId).then(rawArchive => {
      try {
        let archive = _loadArchive(rawArchive, client)
        resolve(archive)
      } catch(err) {
        console.error(err)
        reject(err)
      }
    })
  })
}

function _loadArchive(rawArchive, client) {
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
  return new TextureArchive(sessions, client)
}
