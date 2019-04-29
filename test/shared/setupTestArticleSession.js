/* global vfs */
import {
  TextureConfigurator, ArticlePackage,
  EditorSession,
  ArticleAPI, createEditorContext,
  VfsStorageClient, TextureArchive, InMemoryDarBuffer
} from '../../index'

export default function setupTestArticleSession (opts = {}) {
  let config = new TextureConfigurator()
  config.import(ArticlePackage)
  // TODO: this could be a little easier
  let manuscriptConfig = config.getConfiguration('article.manuscript')

  // load the empty archive
  let storage = new VfsStorageClient(vfs, './data/')
  let archive = new TextureArchive(storage, new InMemoryDarBuffer(), {}, config)
  // ATTENTION: in case of the VFS loading is synchronous
  // TODO: make sure that this is always the case
  let archiveId = opts.archiveId || 'blank'
  archive.load(archiveId, () => {})
  let documentSession = archive.getDocumentSession('manuscript')
  let doc = documentSession.getDocument()
  if (opts.seed) {
    // clear the body
    let body = doc.get('body')
    body.set('content', [])
    opts.seed(doc)
  }
  // NOTE: this indirection is necessary because we need to pass the context to parts of the context
  let contextProvider = {}
  let editorSession = new EditorSession('test-editor', documentSession, manuscriptConfig, contextProvider)
  let api = new ArticleAPI(editorSession, manuscriptConfig, archive)
  let context = Object.assign(createEditorContext(manuscriptConfig, editorSession), { api })
  // ... after the context is ready we can store it into the provider
  contextProvider.context = context

  return { context, editorSession, doc, archive, api }
}
