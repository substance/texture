/* global vfs */
import {
  TextureConfigurator, ArticlePackage,
  ArticleEditorSession,
  ArticleAPI, createEditorContext,
  VfsStorageClient, TextureArchive, InMemoryDarBuffer
} from 'substance-texture'

export default function setupTestArticleSession (opts = {}) {
  let config = new TextureConfigurator()
  config.import(ArticlePackage)
  let articleConfig = config.getConfiguration('article')

  // load the empty archive
  let storage = new VfsStorageClient(vfs, './data/')
  let archive = new TextureArchive(storage, new InMemoryDarBuffer(), {}, config)
  // ATTENTION: in case of the VFS loading is synchronous
  // TODO: make sure that this is always the case
  let archiveId = opts.archiveId || 'blank'
  archive.load(archiveId, () => {})
  let doc = archive.getDocument('manuscript')
  if (opts.seed) {
    // clear the body
    let body = doc.get('body')
    body.set('content', [])
    opts.seed(doc)
  }
  // NOTE: this indirection is necessary because we need to pass the context to parts of the context
  let editorSession = new ArticleEditorSession('test-editor', doc, articleConfig)
  let api = new ArticleAPI(editorSession, archive, articleConfig)
  let context = Object.assign(createEditorContext(articleConfig, editorSession), { api })
  editorSession.setContext(context)
  editorSession.initialize()

  return { context, editorSession, doc, archive, api }
}
