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
    loader.load(`data/${example}`).then(archive => {
      Texture.mount({ archive }, window.document.body)
    })
  }
  // Otherwise create a stub archive,
  else {
    let exampleId = getQueryStringParam('file') || 'kitchen-sink.xml'
    let xml = vfs.readFileSync(exampleId)
    let sessions = {
      'manifest': ManifestLoader.load(createStubArchiveXml(exampleId)),
      'manuscript': ArticleLoader.load(xml),
      'pub-meta': PubMetaLoader.load([])
    }
    let archive = new DocumentArchive(sessions)
    Texture.mount({ archive }, window.document.body)
  }
  // TODO: on the long run we want provide a version that can be used
  // with an archive hosted on a server
})
