import { forEach, without } from 'substance'

import AnnotatedTextModel from './models/AnnotatedTextModel'
import ContainerModel from './models/ContainerModel'
import ContribsModel from './models/ContribsModel'
import MetaModel from './models/MetaModel'
import ReferencesModel from './models/ReferencesModel'

import ReferenceManager from './editor/ReferenceManager'
import FigureManager from './editor/FigureManager'
import TableManager from './editor/TableManager'
import FootnoteManager from './editor/FootnoteManager'
import DefaultModel from './models/DefaultModel'
import entityRenderers from './shared/entityRenderers'

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
  getModel (type, node) {
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
    let node
    this.pubMetaDbSession.transaction((tx) => {
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

  deletePerson(personId, type) {
    const articleSession = this.articleSession
    const model = this.deleteEntity(personId)
    articleSession.transaction(tx => {
      const personsContribGroup = tx.find(`contrib-group[content-type=${type}]`)
      const contrib = personsContribGroup.find(`contrib[rid=${personId}]`)
      contrib.parentNode.removeChild(contrib)
      tx.delete(contrib.id)
    })
    return model
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

  deleteOrganisation(orgId) {
    const articleSession = this.articleSession
    const model = this.deleteEntity(orgId)
    articleSession.transaction(tx => {
      const affGroup = tx.find('aff-group')
      const affEl = affGroup.find(`aff[rid=${orgId}]`)
      affEl.parentNode.removeChild(affEl)
      tx.delete(affEl.id)
    })
    return model
  }

  addAward(award = {}) {
    const articleSession = this.articleSession
    const awardModel = this.addEntity(award, 'award')
    articleSession.transaction(tx => {
      const awardGroupEl = tx.createElement('award-group').attr('rid', awardModel.id)
      const fundingGroupEl = tx.find('funding-group')
      fundingGroupEl.append(awardGroupEl)
    })
    return awardModel
  }

  deleteAward(awardId) {
    const articleSession = this.articleSession
    const model = this.deleteEntity(awardId)
    articleSession.transaction(tx => {
      const fundingGroup = tx.find('funding-group')
      const awardGroupEl = fundingGroup.find(`award-group[rid=${awardId}]`)
      awardGroupEl.parentNode.removeChild(awardGroupEl)
      tx.delete(awardGroupEl.id)
    })
    return model
  }

  addKeyword(keyword = {}) {
    const articleSession = this.articleSession
    const keywordModel = this.addEntity(keyword, 'keyword')
    articleSession.transaction(tx => {
      const kwdEl = tx.createElement('kwd').attr('rid', keywordModel.id)
      const kwdGroupEl = tx.find('kwd-group')
      kwdGroupEl.append(kwdEl)
    })
    return keywordModel
  }

  deleteKeyword(keywordId) {
    const articleSession = this.articleSession
    const model = this.deleteEntity(keywordId)
    articleSession.transaction(tx => {
      const kwdGroup = tx.find('kwd-group')
      const kwdEl = kwdGroup.find(`kwd[rid=${keywordId}]`)
      kwdEl.parentNode.removeChild(kwdEl)
      tx.delete(kwdEl.id)
    })
    return model
  }

  addSubject(subject = {}) {
    const articleSession = this.articleSession
    const subjectModel = this.addEntity(subject, 'subject')
    articleSession.transaction(tx => {
      const subjectEl = tx.createElement('subject').attr('rid', subjectModel.id)
      const subjGroupEl = tx.find('subj-group')
      subjGroupEl.append(subjectEl)
    })
    return subjectModel
  }

  deleteSubject(subjectId) {
    const articleSession = this.articleSession
    const model = this.deleteEntity(subjectId)
    articleSession.transaction(tx => {
      const subjGroup = tx.find('subj-group')
      const subjectEl = subjGroup.find(`subject[rid=${subjectId}]`)
      subjectEl.parentNode.removeChild(subjectEl)
      tx.delete(subjectEl.id)
    })
    return model
  }

  deleteReference(refId) {
    const article = this.getArticle()
    const articleSession = this.articleSession
    const xrefIndex = article.getIndex('xrefs')
    const xrefs = xrefIndex.get(refId)
    articleSession.transaction(tx => {
      const refList = tx.find('ref-list')
      let node = tx.get(refId)
      // ATTENTION: it is important to nodes from the transaction tx!
      // Be careful with closures here.
      refList.removeChild(node)
      tx.delete(node.id)
      // Now update xref targets
      xrefs.forEach(xrefId => {
        let xref = tx.get(xrefId)
        let idrefs = xref.attr('rid').split(' ')
        idrefs = without(idrefs, refId)
        xref.setAttribute('rid', idrefs.join(' '))
      })
      tx.setSelection(null)
    })
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
    let fns = this.doc.findAll('fn-group > fn')
    return fns.map(fn => this.getModel(fn.type, fn))
  }

  getReferences () {
    let refList = this.doc.find('ref-list')
    return new ReferencesModel(refList, this._getContext())
  }

  getFigures () {
    let figs = this.doc.findAll('fig')
    return figs.map(fig => this.getModel(fig.type, fig))
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
