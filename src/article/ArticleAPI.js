import { without } from 'substance'

import AnnotatedTextModel from './models/AnnotatedTextModel'

import ContainerModel from './models/ContainerModel'
import ContribsModel from './models/ContribsModel'
import MetaModel from './models/MetaModel'
import DefaultModel from './models/DefaultModel'
import entityRenderers from './shared/entityRenderers'
import TranslateableModel from './models/TranslateableModel'
import TranslationModel from './models/TranslationModel'

export default class ArticleAPI {
  constructor (articleSession, modelRegistry) {
    this.modelRegistry = modelRegistry
    this.articleSession = articleSession
    this.article = articleSession.getDocument()
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
    let entityNode = this.article.get(entityId)
    let model = this.getModel(entityNode.type, entityNode)
    return model
  }

  _getNode(nodeId) {
    return this.article.get(nodeId)
  }

  getEntitiesByType(type) {
    let entityIds = this.article.findByType(type)
    return entityIds.map(entityId => this.getEntity(entityId))
  }

  // TODO: This method we should move into the API!
  renderEntity(model) {
    return entityRenderers[model.type](model.id, this.getArticle())
  }

  getArticle () {
    return this.article
  }

  getArticleSession () {
    return this.articleSession
  }

  /*
    Returns an entity model (not node!)
  */
  addEntity(data, type) {
    const newNode = Object.assign({}, data, {
      type: type
    })
    let node
    this.articleSession.transaction(tx => {
      tx.selection = null
      node = tx.create(newNode)
    })
    return this.getModel(node.type, node)
  }

  /*
    Returns an entity model (not node!)
  */
  deleteEntity(entityId) {
    let node
    this.articleSession.transaction((tx) => {
      node = tx.delete(entityId)
      tx.selection = null
    })
    return this.getModel(node.type, node)
  }
  
  addAuthor(person = {}) {
    this._addPerson(person, 'authors')
  }

  addEditor(person = {}) {
    this._addPerson(person, 'editors')
  }

  _addPerson(person = {}, type) {
    const newNode = Object.assign({}, person, {
      type: 'person'
    })
    let node
    this.articleSession.transaction(tx => {
      node = tx.create(newNode)
      const articleRecord = tx.get('article-record')
      let length = articleRecord[type].length
      tx.update(['article-record', type], { type: 'insert', pos: length, value: node.id })
      tx.selection = null
    })
    return this.getModel(node.type, node)
  }

  getAuthors() {
    return this._getPersons('authors')
  }

  getEditors() {
    return this._getPersons('editors')
  }

  _getPersons(prop) {
    let articleRecord = this._getNode('article-record')
    let persons = articleRecord[prop].map(personId => this.getEntity(personId))
    return persons
  }

  deleteAuthor(personId) {
    return this._deletePerson(personId, 'authors')
  }

  deleteEditor(personId) {
    return this._deletePerson(personId, 'editors')
  }

  _deletePerson(personId, type) {
    let node
    this.articleSession.transaction((tx) => {
      node = tx.delete(personId)
      const articleRecord = tx.get('article-record')
      let pos = articleRecord[type].indexOf(personId)
      if (pos !== -1) {
        tx.update(['article-record', type], { type: 'delete', pos: pos })
      }
      tx.selection = null
    })
    return this.getModel(node.type, node)
  }

  addOrganisation(organisation = {}) {
    const orgModel = this.addEntity(organisation, 'organisation')
    return orgModel
  }

  deleteOrganisation(orgId) {
    const model = this.deleteEntity(orgId)
    return model
  }

  addAward(award = {}) {
    const awardModel = this.addEntity(award, 'award')
    return awardModel
  }

  deleteAward(awardId) {
    const model = this.deleteEntity(awardId)
    return model
  }

  addKeyword(keyword = {}) {
    const keywordModel = this.addEntity(keyword, 'keyword')
    return keywordModel
  }

  deleteKeyword(keywordId) {
    const model = this.deleteEntity(keywordId)
    return model
  }

  addSubject(subject = {}) {
    const subjectModel = this.addEntity(subject, 'subject')
    return subjectModel
  }

  deleteSubject(subjectId) {
    const model = this.deleteEntity(subjectId)
    return model
  }

  addReference(reference = {}, type) {
    const articleSession = this.articleSession
    const referenceModel = this.addEntity(reference, type)
    articleSession.transaction(tx => {
      const refEl = tx.createElement('ref').attr('rid',referenceModel.id)
      const refList = tx.find('ref-list')
      refList.append(refEl)
      tx.selection = null
    })
    return referenceModel
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
      tx.selection = null
    })
  }

  /*
    Article language code

    Falls back to 'en'
  */
  getOriginalLanguageCode() {
    let article = this.getArticle().getRootNode()
    return article.attr('xml:lang') || 'en'
  }

  /*
    NOTE: This only works for collection that contain a single item type. We may need to rethink this
  */
  getCollectionForType(type) {
    const model = this.getModel(type+'s')
    return model.getItems()
  }


  getSchema(type) {
    return this.article.getSchema().getNodeSchema(type)
  }

  getArticleTitle() {
    let articleTitle = this.getArticle().find('article-title')
    return new AnnotatedTextModel(this, articleTitle)
  }

  getArticleAbstract () {
    let abstract = this.getArticle().find('abstract')
    return new ContainerModel(this, abstract)
  }

  getArticleBody () {
    let body = this.getArticle().find('body')
    return new ContainerModel(this, body)
  }

  getContribs () {
    let articleMeta = this.getArticle().find('article-meta')
    return new ContribsModel(articleMeta, this._getContext())
  }

  getMeta () {
    let articleMeta = this.getArticle().find('article-meta')
    return new MetaModel(articleMeta, this._getContext())
  }

  getFootnotes () {
    let fns = this.getArticle().findAll('fn-group > fn')
    return fns.map(fn => this.getModel(fn.type, fn))
  }

  getFigures () {
    let figs = this.getArticle().findAll('fig')
    return figs.map(fig => this.getModel(fig.type, fig))
  }

  getTranslatables () {
    return [
      this._getTitleTranslateable(),
      this._getAbstractTranslateable()
    ]
  }

  addTranslation (translatableId, languageCode) {
    if (translatableId === 'title-trans') {
      this._addTitleTranslation(languageCode)
    } else if (translatableId === 'abstract-trans') {
      this._addAbstractTranslation(languageCode)
    }
  }

  _addTitleTranslation(languageCode) {
    const articleSession = this.articleSession
    articleSession.transaction(tx => {
      const titleEl = tx.createElement('trans-title-group').attr('xml:lang', languageCode).append(
        tx.createElement('trans-title')
      )
      const titleGroup = tx.find('title-group')
      titleGroup.append(titleEl)
    })
  }

  _addAbstractTranslation(languageCode) {
    const articleSession = this.articleSession
    articleSession.transaction(tx => {
      const abstractEl = tx.createElement('trans-abstract').attr('xml:lang', languageCode).append(
        tx.createElement('p')
      )
      // TODO: replace it with schema driven smartness
      const abstract = tx.find('article-meta > abstract')
      const articleMeta = abstract.getParent()
      const abtractPos = articleMeta.getChildPosition(abstract)
      articleMeta.insertAt(abtractPos+1, abstractEl)
    })
  }

  deleteTranslation (translatableId, languageCode) {
    if (translatableId === 'title-trans') {
      this._deleteTitleTranslation(languageCode)
    } else if (translatableId === 'abstract-trans') {
      this._deleteAbstractTranslation(languageCode)
    }
  }

  _deleteTitleTranslation(languageCode) {
    const articleSession = this.articleSession
    articleSession.transaction(tx => {
      // HACK: attribute selector with colon is invalid
      const titles = tx.findAll('trans-title-group')
      const titleEl = titles.find(t => t.attr('xml:lang') === languageCode)
      titleEl.parentNode.removeChild(titleEl)
      tx.delete(titleEl.id)
    })
  }

  _deleteAbstractTranslation(languageCode) {
    const articleSession = this.articleSession
    articleSession.transaction(tx => {
      // HACK: attribute selector with colon is invalid
      const abstracts = tx.findAll('trans-abstract')
      const abstractEl = abstracts.find(a => a.attr('xml:lang') === languageCode)
      abstractEl.parentNode.removeChild(abstractEl)
      tx.delete(abstractEl.id)
    })
  }

  _getTitleTranslateable() {
    let transTitleGroups = this.getArticle().findAll('trans-title-group')
    const translatableId = 'title-trans'
    let translations = transTitleGroups.map(transTitleGroup => {
      let transTitle = transTitleGroup.find('trans-title')
      let transTitleModel = new AnnotatedTextModel(this, transTitle, this._getContext())
      return new TranslationModel(this, transTitleModel, translatableId, transTitleGroup.attr('xml:lang'))
    })

    return new TranslateableModel(
      this,
      translatableId,
      this.getOriginalLanguageCode(),
      this.getArticleTitle(),
      translations
    )
  }

  _getAbstractTranslateable() {
    let transAbstracts = this.getArticle().findAll('trans-abstract')
    const translatableId = 'abstract-trans'
    let translations = transAbstracts.map(transAbstract => {
      let transAbstractModel = new ContainerModel(this, transAbstract, this._getContext())
      return new TranslationModel(this, transAbstractModel, translatableId, transAbstract.attr('xml:lang'))
    })

    return new TranslateableModel(
      this,
      translatableId,
      this.getOriginalLanguageCode(),
      this.getArticleAbstract(),
      translations
    )
  }

  _getContext () {
    return this._context
  }

  /*
    TODO: In the future it should be necessary to expose those managers, instead
    API's should be used to access information.
  */
  getFigureManager () {
    return this.getArticleSession().getFigureManager()
  }

  getFootnoteManager () {
    return this.getArticleSession().getFootnoteManager()
  }

  getReferenceManager () {
    return this.getArticleSession().getReferenceManager()
  }

  getTableManager () {
    return this.getArticleSession().getTableManager()
  }

  get doc () {
    console.error('DEPRECATED: use api.getArticle() instead.')
    return this.getArticle()
  }
}
