import {
  TextureConfigurator, ArticlePackage,
  InternalArticleDocument, ArticleEditorSession,
  ArticleAPI, createEditorContext
} from '../index'

export default function setupTestArticleSession (docInitializer) {
  let configurator = new TextureConfigurator()
  configurator.import(ArticlePackage)
  // TODO: this could be a little easier
  let config = configurator.getConfiguration('article').getConfiguration('manuscript')
  let doc = InternalArticleDocument.createEmptyArticle(config.getSchema())
  if (docInitializer) {
    docInitializer(doc)
  }
  // NOTE: this indirection is necessary because we need to pass the context to parts of the context
  let contextProvider = {}
  let editorSession = new ArticleEditorSession(doc, config, contextProvider)
  let api = new ArticleAPI(editorSession, config.getModelRegistry())
  let context = Object.assign(createEditorContext(config, editorSession), { api })
  // ... after the context is ready we can store it into the provider
  contextProvider.context = context

  return { context, editorSession, doc }
}
