import AnnotatedTextModel from './models/AnnotatedTextModel'
import ContainerModel from './models/ContainerModel'
import ContribsModel from './models/ContribsModel'
import ReferencesModel from './models/ReferencesModel'

export default class TextureArticleAPI {
  constructor(editorSession, pubMetaDbSession, modelRegistry) {
    this.modelRegistry = modelRegistry
    this.editorSession = editorSession
    this.pubMetaDbSession = pubMetaDbSession
    this.pubMetaDb = pubMetaDbSession.getDocument()
    this.doc = editorSession.getDocument()
  }

  getArticleTitle() {
    let articleTitle = this.doc.find('article-title')
    return new AnnotatedTextModel(articleTitle, this._getContext())
  }

  getArticleAbstract() {
    let abstract = this.doc.find('abstract')
    return new ContainerModel(abstract, this._getContext())
  }

  getArticleBody() {
    let body = this.doc.find('body')
    return new ContainerModel(body, this._getContext())
  }

  getContribs() {
    let articleMeta = this.doc.find('article-meta')
    return new ContribsModel(articleMeta, this._getContext())
  }

  getReferences() {
    let refList = this.doc.find('ref-list')
    return new ReferencesModel(refList, this._getContext())
  }

  /*
    Get corresponding model for a given node. This used for most block content types (e.g. Figure, Heading etc.)
  */
  getModel(node) {
    let ModelClass = this.modelRegistry[node.type]
    if (ModelClass) {
      return new ModelClass(node, this._getContext())
    }
  }

  _getContext() {
    return {
      editorSession: this.editorSession,
      doc: this.doc,
      pubMetaDbSession: this.pubMetaDbSession,
      pubMetaDb: this.pubMetaDb
    }
  }
}


