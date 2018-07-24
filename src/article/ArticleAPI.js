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

  addPerson(person = {}, type) {
    const articleSession = this.articleSession
    const personModel = this.addEntity(person, 'person')
    articleSession.transaction(tx => {
      const contribEl = tx.createElement('contrib').attr({'rid': personModel.id, 'contrib-type': 'person'})
      const personContribGroup = tx.find('contrib-group[content-type='+type+']')
      personContribGroup.append(contribEl)
      tx.selection = null
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
      tx.selection = null
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
      tx.selection = null
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
      tx.selection = null
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
      tx.selection = null
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
      tx.selection = null
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
      tx.selection = null
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
      tx.selection = null
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
      tx.selection = null
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
      tx.selection = null
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
      const articleMeta = tx.find('article-meta')
      articleMeta.append(abstractEl)
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
      const abstractEl = tx.find('trans-abstract[xml:lang'+languageCode+']')

      const subjGroup = tx.find('subj-group')
      const subjectEl = subjGroup.find(`subject[rid=${subjectId}]`)
      subjectEl.parentNode.removeChild(subjectEl)
      tx.delete(subjectEl.id)

      const abstractEl = tx.createElement('trans-abstract').attr('xml:lang', languageCode).append(
        tx.createElement('p')
      )
      const articleMeta = tx.find('article-meta')
      articleMeta.append(abstractEl)
    })
  }

  _deleteAbstractTranslation(languageCode) {
    
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
