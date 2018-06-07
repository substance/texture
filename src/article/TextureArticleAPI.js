import AnnotatedTextModel from './models/AnnotatedTextModel'
import ContainerModel from './models/ContainerModel'
import ContribsModel from './models/ContribsModel'
import ReferencesModel from './models/ReferencesModel'

import ReferenceManager from '../editor/util/ReferenceManager'
import FigureManager from '../editor/util/FigureManager'
import TableManager from '../editor/util/TableManager'
import FootnoteManager from '../editor/util/FootnoteManager'

export default class TextureArticleAPI {
  constructor(editorSession, pubMetaDbSession, modelRegistry) {
    this.modelRegistry = modelRegistry
    this.editorSession = editorSession
    this.pubMetaDbSession = pubMetaDbSession
    this.pubMetaDb = pubMetaDbSession.getDocument()
    this.doc = editorSession.getDocument()

    // Create managers
    this.referenceManager = new ReferenceManager({
      labelGenerator: editorSession.getConfigurator().getLabelGenerator('references'),
      editorSession,
      pubMetaDbSession
    })
    this.figureManager = new FigureManager({
      labelGenerator: editorSession.getConfigurator().getLabelGenerator('figures'),
      editorSession
    })
    this.tableManager = new TableManager({
      labelGenerator: editorSession.getConfigurator().getLabelGenerator('tables'),
      editorSession
    })
    this.footnoteManager = new FootnoteManager({
      labelGenerator: editorSession.getConfigurator().getLabelGenerator('footnotes'),
      editorSession
    })
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
      pubMetaDb: this.pubMetaDb,
      referenceManager: this.referenceManager,
      figureManager: this.figureManager,
      tableManager: this.tableManager,
      footnoteManager: this.footnoteManager
    }
  }

  /*
    TODO: In the future it should be necessary to expose those managers, instead
    API's should be used to access information.
  */
  getFigureManager() {
    return this.figureManager
  }

  getTableManager() {
    return this.tableManager
  }

  getFootnoteManager() {
    return this.footnoteManager
  }

  getReferenceManager() {
    return this.footnoteManager
  }
}


