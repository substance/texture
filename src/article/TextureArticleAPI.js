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

export default class TextureArticleAPI {
  constructor (editorSession, pubMetaDbSession, modelRegistry) {
    this.modelRegistry = modelRegistry
    this.editorSession = editorSession
    this.pubMetaDbSession = pubMetaDbSession
    this.pubMetaDb = pubMetaDbSession.getDocument()
    this.doc = editorSession.getDocument()

    const configurator = this._getConfigurator()
    // Create managers
    this.referenceManager = new ReferenceManager({
      labelGenerator: configurator.getLabelGenerator('references'),
      editorSession,
      pubMetaDbSession
    })
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
    this._context = {
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
    }

    // workaround for an ownership problem, because EditorSession
    // is constructing a lot of managers,
    // and the context for these are passed while loading the archive
    // While being a bit hacky, this is the easiest way to solve the problem,
    // on an appropriate level.
    // On the long run, the managers should not be owned by the EditorSession
    this._monkeyPatchEditorSession(this._context)
  }

  getCollection(colName) {
    let items = []
    switch(colName) {
      case 'authors':
        items = this.getContribs().getAuthors()
        break
      case 'awards':
        items = this.getContribs().getAwards()
        break
      case 'keywords':
        items = this.getMeta().getKeywords()
        break
      case 'subjects':
        items = this.getMeta().getSubjects()
        break
      case 'references':
        items = this.getReferences().getBibliography()
        break
      default:
        console.error('There is no collection', colName)
    }
    return items
  }

  getCollectionForType(type) {
    return this.getCollection(type+'s')
  }

  getSchema(type) {
    return this.pubMetaDbSession.getDocument().getSchema().getNodeSchema(type)
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

  getMeta() {
    let articleMeta = this.doc.find('article-meta')
    return new MetaModel(articleMeta, this._getContext())
  }

  getFootnotes() {
    let fnGroup = this.doc.find('fn-group')
    return new FootnotesModel(fnGroup, this._getContext())
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

  _getContext () {
    return this._context
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
    return this.referenceManager
  }

  _getConfigurator () {
    return this.editorSession.getConfigurator()
  }

  _monkeyPatchEditorSession (context) {
    const editorSession = this.editorSession
    const configurator = editorSession.getConfigurator()

    // exchange the context that EditorSession is propagating
    editorSession._context = context

    // these managers receive a context so need to be replaced
    const CommandManager = configurator.getCommandManagerClass()
    editorSession.commandManager.dispose()
    editorSession.commandManager = new CommandManager(context, configurator.getCommands())

    const FileManager = configurator.getFileManagerClass()
    editorSession.fileManager.dispose()
    editorSession.fileManager = new FileManager(editorSession, configurator.getFileAdapters(), context)

    const DragManager = configurator.getDragManagerClass()
    editorSession.dragManager.dispose()
    editorSession.dragManager = new DragManager(configurator.getDropHandlers(), Object.assign({}, context, {
      commandManager: editorSession.commandManager
    }))

    const MacroManager = configurator.getMacroManagerClass()
    editorSession.macroManager.dispose()
    editorSession.macroManager = new MacroManager(context, configurator.getMacros())

    const KeyboardManager = configurator.getKeyboardManagerClass()
    // Note: keyboardManager does not have a dispose()
    // TODO: maybe it should, just for consistency, even if it is empty
    // editorSession.keyboardManager.dispose()
    editorSession.keyboardManager = new KeyboardManager(editorSession, configurator.getKeyboardShortcuts(), {
      context
    })

    forEach(editorSession._managers, (manager) => {
      if (manager.dispose) {
        manager.dispose()
      }
    })
    let customManagers = {}
    forEach(configurator.getManagers(), (ManagerClass, name) => {
      customManagers[name] = new ManagerClass(context)
    })
    editorSession._managers = customManagers
  }
}
