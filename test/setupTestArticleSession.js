/* global vfs */
import {
  TextureConfigurator, ArticlePackage,
  ArticleEditorSession,
  ArticleAPI, createEditorContext,
  VfsStorageClient, TextureArchive, InMemoryDarBuffer
} from '../index'

export default function setupTestArticleSession (docInitializer) {
  let configurator = new TextureConfigurator()
  configurator.import(ArticlePackage)
  // TODO: this could be a little easier
  let config = configurator.getConfiguration('article').getConfiguration('manuscript')

  // load the empty archive
  let storage = new VfsStorageClient(vfs, './data/')
  let archive = new TextureArchive(storage, new InMemoryDarBuffer())
  // ATTENTION: in case of the VFS loading is synchronous
  // TODO: make sure that this is always the case
  archive.load('blank', () => {})
  let session = archive.getEditorSession('manuscript')
  let doc = session.getDocument()
  if (docInitializer) {
    docInitializer(doc)
  }
  // NOTE: this indirection is necessary because we need to pass the context to parts of the context
  let contextProvider = {}
  let editorSession = new ArticleEditorSession(doc, config, contextProvider)
  let api = new ArticleAPI(editorSession, config, archive)
  let context = Object.assign(createEditorContext(config, editorSession), { api })
  // ... after the context is ready we can store it into the provider
  contextProvider.context = context

  return { context, editorSession, doc, archive }
}
