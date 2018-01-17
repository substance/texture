import {
  VfsLoader, getQueryStringParam, DocumentArchive, ManifestLoader,
} from 'substance'
import { ArticleLoader, PubMetaLoader, Texture } from 'substance-texture'

function createStubArchiveXml(docId) {
  return `<container>
  <documents>
    <document id="manuscript" type="article" path="${docId}" />
  </documents>
</container>`
}

window.addEventListener('load', () => {
  const vfs = window.vfs
  // If a document archive is given, load it from the vfs
  let archiveId = getQueryStringParam('archive')
  if (archiveId) {
    const loaders = {
      'article': ArticleLoader,
      'pub-meta': PubMetaLoader
    }
    let loader = new VfsLoader(vfs, loaders)
    // TODO: we need to catch errors
    loader.load(archiveId).then(archive => {
      Texture.mount({ archive }, window.document.body)
    })
  }
  // TODO: this is kind of an ingestion example
  // where only an XML is given which is turned into a DocumentArchive
  else {
    let exampleId = getQueryStringParam('file') || 'kitchen-sink.xml'
    let xml = vfs.readFileSync(exampleId)
    // TODO: we need to figure out how to implement ingestion as opposed
    // to a regular archive. For ingestion, the importer should create
    // new pub-meta entities from the XML. In other cases it should not do this automatically.
    let pubMetaSession = PubMetaLoader.load()
    let manuscriptSession = ArticleLoader.load(xml, {
      pubMetaDb: pubMetaSession.getDocument()
    })
    let sessions = {
      'manifest': ManifestLoader.load(createStubArchiveXml(exampleId)),
      'manuscript': manuscriptSession,
      'pub-meta': pubMetaSession
    }
    let archive = new DocumentArchive(sessions)
    Texture.mount({ archive }, window.document.body)
  }
  // TODO: on the long run we want provide a version that can be used
  // with an archive hosted on a server
})
