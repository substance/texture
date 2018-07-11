import { forEach } from 'substance'

import AnnotatedTextModel from './models/AnnotatedTextModel'
import ContainerModel from './models/ContainerModel'
import ContribsModel from './models/ContribsModel'
import MetaModel from './models/MetaModel'
import FootnotesModel from './models/FootnotesModel'
import ReferencesModel from './models/ReferencesModel'

import ReferenceManager from '../editor/util/ReferenceManager'
import FigureManager from '../editor/util/FigureManager'
import TableManager from '../editor/util/TableManager'
import FootnoteManager from '../editor/util/FootnoteManager'
import DefaultModel from './models/DefaultModel'
import entityRenderers from '../entities/entityRenderers'


export default class ArticleAPI {
  constructor (configurator, articleSession, pubMetaDbSession, context) {
    this.configurator = configurator
    this.modelRegistry = configurator.getModelRegistry()
    this.articleSession = articleSession
    this.pubMetaDbSession = pubMetaDbSession
    this.pubMetaDb = pubMetaDbSession.getDocument()
    this.doc = articleSession.getDocument()
    const editorSession = articleSession

    // Create managers
    this.referenceManager = new ReferenceManager({
      labelGenerator: configurator.getLabelGenerator('references'),
      editorSession,
      pubMetaDbSession
    })
    // HACK: we need to expose referenceManager somehow, so it can be used in
    // the JATSExporter. We may want to consider including referenceManager in
    // TODO: Exporters should use the API instead
    this.doc.referenceManager = this.referenceManager

    this.figureManager = new FigureManager({
      labelGenerator: configurator.getLabelGenerator('figures'),
      editorSession
    })
    this.tableManager = new TableManager({
      labelGenerator: configurator.getLabelGenerator('tables'),
      editorSession
    })
    this.footnoteManager = new FootnoteManager({
      labelGenerator: configurator.getLabelGenerator('footnotes'),
      editorSession
    })
    // this will be passed to other managers etc.
    this._context = Object.assign({}, context, {
      api: this,
      // TODO: try to get rid of this by switching to the 'api'
      editorSession,
      pubMetaDbSession,
      referenceManager: this.referenceManager,
      figureManager: this.figureManager,
      tableManager: this.tableManager,
      footnoteManager: this.footnoteManager,
      get pubMetaDb () { return pubMetaDbSession.getDocument() },
      get doc () { return editorSession.getDocument() },
      get surfaceManager () { return editorSession.surfaceManager }
    })

    const CommandManager = configurator.getCommandManagerClass()
    this.commandManager = new CommandManager(this._context, configurator.getCommands())

    const FileManager = configurator.getFileManagerClass()
    this.fileManager = new FileManager(editorSession, configurator.getFileAdapters(), this._context)

    const DragManager = configurator.getDragManagerClass()
    this.dragManager = new DragManager(configurator.getDropHandlers(), Object.assign({}, this._context, {
      commandManager: this.commandManager
    }))

    const MacroManager = configurator.getMacroManagerClass()
    this.macroManager = new MacroManager(this._context, configurator.getMacros())

    const KeyboardManager = configurator.getKeyboardManagerClass()
    this.keyboardManager = new KeyboardManager(editorSession, configurator.getKeyboardShortcuts(), {
      context: this._context
    })

    this.customManagers = {}
    forEach(configurator.getManagers(), (ManagerClass, name) => {
      this.customManagers[name] = new ManagerClass(this._context)
    })
  }

  /*
    Get corresponding model for a given node. This used for most block content types (e.g. Figure, Heading etc.)
  */
  getModel(type, node) {
    let ModelClass = this.modelRegistry[type]
    if (ModelClass) {
      return new ModelClass(this, node)
    } else {
      return new DefaultModel(this, node)
      // throw new Error(`No model for ${type} found.`)
    }
  }

  /*
    Returns an entity model (not node!)
  */
  getEntity(entityId) {
    let entityNode = this.pubMetaDb.get(entityId)
    let model = this.getModel(entityNode.type, entityNode)
    return model
  }

  getEntitiesByType(type) {
    let entityIds = this.pubMetaDb.findByType(type)
    return entityIds.map(entityId => this.getEntity(entityId))
  }

  // TODO: This method we should move into the API!
  renderEntity(model) {
    return entityRenderers[model.type](model.id, this.pubMetaDb)
  }

  getArticle() {
    return this.doc
  }

  getPubMetaDb() {
    return this.pubMetaDb
  }

  /*
    Returns an entity model (not node!)
  */
  addEntity(data, type) {
    const newNode = Object.assign({}, data, {
      type: type
    })
    let node
    this.pubMetaDbSession.transaction((tx) => {
      node = tx.create(newNode)
    })
    return this.getModel(node.type, node)
  }

  /*
    Returns an entity model (not node!)
  */
  deleteEntity(entityId) {
    const pubMetaDbSession = this.context.pubMetaDbSession
    let node
    pubMetaDbSession.transaction((tx) => {
      node = tx.delete(entityId)
    })
    return this.getModel(node.type, node)
  }

  addPerson(person = {}, type) {
    const articleSession = this.articleSession
    const personModel = this.addEntity(person, 'person')
    articleSession.transaction(tx => {
      const contribEl = tx.createElement('contrib').attr({'rid': personModel.id, 'contrib-type': 'person'})
      const personContribGroup = tx.find('contrib-group[content-type='+type+']')
      personContribGroup.append(contribEl)
    })
    return personModel
  }

  getPersons(type) {
    const article = this.getArticle()
    const personsContribGroup = article.find('contrib-group[content-type='+type+']')
    const contribIds = personsContribGroup.findAll('contrib[contrib-type=person]').map(contrib => contrib.getAttribute('rid'))
    return contribIds.map(contribId => this.getEntity(contribId))
  }

  addOrganisation(organisation = {}) {
    const articleSession = this.articleSession
    const orgModel = this.addEntity(organisation, 'organisation')
    articleSession.transaction(tx => {
      const affEl = tx.createElement('aff').attr('rid', orgModel.id)
      const affGroup = tx.find('aff-group')
      affGroup.append(affEl)
    })
    return orgModel
  }

  /*
    NOTE: This only works for collection that contain a single item type. We may need to rethink this
  */
  getCollectionForType(type) {
    const model = this.getModel(type+'s')
    return model.getItems()
  }


  getSchema(type) {
    return this.pubMetaDbSession.getDocument().getSchema().getNodeSchema(type)
  }

  getArticleTitle() {
    let articleTitle = this.doc.find('article-title')
    return new AnnotatedTextModel(articleTitle, this._getContext())
  }

  getArticleAbstract () {
    let abstract = this.doc.find('abstract')
    return new ContainerModel(abstract, this._getContext())
  }

  getArticleBody () {
    let body = this.doc.find('body')
    return new ContainerModel(body, this._getContext())
  }

  getContribs () {
    let articleMeta = this.doc.find('article-meta')
    return new ContribsModel(articleMeta, this._getContext())
  }

  getMeta() {
    let articleMeta = this.doc.find('article-meta')
    return new MetaModel(articleMeta, this._getContext())
  }

  getFootnotes () {
    let fnGroup = this.doc.find('fn-group')
    return new FootnotesModel(fnGroup, this._getContext())
  }

  getReferences () {
    let refList = this.doc.find('ref-list')
    return new ReferencesModel(refList, this._getContext())
  }

  _getContext () {
    return this._context
  }

  /*
    TODO: In the future it should be necessary to expose those managers, instead
    API's should be used to access information.
  */
  getFigureManager () {
    return this.figureManager
  }

  getTableManager () {
    return this.tableManager
  }

  getFootnoteManager () {
    return this.footnoteManager
  }

  getReferenceManager () {
    return this.referenceManager
  }
}
