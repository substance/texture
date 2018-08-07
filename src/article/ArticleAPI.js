import { without } from 'substance'

import AbstractAPI from '../shared/AbstractAPI'
import DynamicCollection from '../shared/DynamicCollection'
import {
  StringModel, TextModel, FlowContentModel
} from '../shared/ValueModel'
import ContribsModel from './models/ContribsModel'
import MetaModel from './models/MetaModel'
// import DefaultModel from './models/DefaultModel'
import renderEntity from './shared/renderEntity'
import TranslateableModel from './models/TranslateableModel'
import TranslationModel from './models/TranslationModel'

import { REQUIRED_PROPERTIES } from './ArticleConstants'

// TODO: this should come from configuration
const COLLECTIONS = {
  'author': 'authors',
  'editor': 'editors'
}

export default class ArticleAPI extends AbstractAPI {
  constructor (articleSession, modelRegistry) {
    super()

    this.modelRegistry = modelRegistry
    this.articleSession = articleSession
    this.article = articleSession.getDocument()
  }

  /*
    Get corresponding model for a given node. This used for most block content types (e.g. Figure, Heading etc.)
  */
  getModel (type, node) {
    let ModelClass = this.modelRegistry[type]
    // HACK: trying to retrieve the node if it is not given
    if (!node) {
      node = this.article.get(type)
    }
    if (ModelClass) {
      return new ModelClass(this, node)
    } else if (node) {
      return this._getModelForNode(node)
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

  // TODO: this should be configurable. As it is similar to HTML conversion
  // we could use the converter registry for this
  renderEntity(model) {
    let entity = this.getArticle().get(model.id)
    return renderEntity(entity)
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

  getAuthorsModel() {
    return this.getModel('authors')
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

  addReferences(refs) {
    const refContribProps = ['authors','editors','inventors','sponsors','translators']
    const articleSession = this.articleSession
    articleSession.transaction(tx => {
      const refList = tx.find('ref-list')
      refs.forEach(ref => {
        refContribProps.forEach(propName => {
          if(ref[propName]) {
            let refContribs = ref[propName].map(contrib => {
              contrib.type = 'ref-contrib'
              const node = tx.create(contrib)
              return node.id
            })
            ref[propName] = refContribs
          }
        })
        const node = tx.create(ref)
        const refEl = tx.createElement('ref').attr('rid',node.id)
        refList.append(refEl)
      })
      tx.selection = null
    })
    return
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
    @return {StringModel} Model for the language code of article's main language
  */
  getOriginalLanguageCode() {
    let article = this.getArticle().getRootNode()
    return new StringModel(this, [article.id, 'attributes', 'xml:lang'])
  }

  getCollectionForType (type) {
    // TODO: need to rethink this.
    // ATM we are registering special model classes for collections,
    // which are named after the single entity they contain,
    // e.g. 'authors' is a the collection of author nodes (which are person nodes essentially).
    // This is currently pretty confusing. It would be better to have
    // specific node in the model for that.
    // Still, we would need a mechanism to specify which node is acting as the parent
    // collection for which node.
    let collectionType = COLLECTIONS[type]
    // I don't like this implicit mapping.
    if (!collectionType) {
      collectionType = type + 's'
    }
    let model = this.getModel(collectionType)
    if (!model) {
      console.error(`No collection specified for type '${type}'. Using DynamicCollection. You should register a collection for this type explicitly.`)
      model = new DynamicCollection(this, type)
    }
    return model
  }

  getSchema(type) {
    return this.article.getSchema().getNodeSchema(type)
  }

  getArticleTitle () {
    let titleNode = this.getArticle().find('article-title')
    return new TextModel(this, titleNode.getPath())
  }

  getArticleAbstract () {
    let abstract = this.getArticle().find('abstract')
    return new FlowContentModel(this, abstract.getContentPath())
  }

  getArticleBody () {
    let body = this.getArticle().find('body')
    return new FlowContentModel(this, body.getContentPath())
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
    let translatableId = 'title-trans'
    let orinialLanguageCode = this.getOriginalLanguageCode()
    let articleTitle = this.getArticleTitle()
    let translations = transTitleGroups.map(transTitleGroup => {
      let transTitle = transTitleGroup.find('trans-title')
      let textModel = new TextModel(this, transTitle.getPath())
      let languageModel = new StringModel(this, [transTitleGroup.id, 'attributes', 'xml:lang'])
      return new TranslationModel(this, translatableId, textModel, languageModel)
    })
    return new TranslateableModel(
      this,
      translatableId,
      orinialLanguageCode,
      articleTitle,
      translations
    )
  }

  _getAbstractTranslateable() {
    let transAbstracts = this.getArticle().findAll('trans-abstract')
    let translatableId = 'abstract-trans'
    let orinialLanguageCode = this.getOriginalLanguageCode()
    let articleAbstract = this.getArticleAbstract()
    let translations = transAbstracts.map(transAbstract => {
      let transAbstractModel = new FlowContentModel(this, [transAbstract.id, '_children'])
      let languageModel = new StringModel(this, [transAbstract.id, 'attributes', 'xml:lang'])
      return new TranslationModel(this, translatableId, transAbstractModel, languageModel)
    })

    return new TranslateableModel(
      this,
      translatableId,
      orinialLanguageCode,
      articleAbstract,
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

  _getDocument () {
    return this.getArticleSession().getDocument()
  }

  _getDocumentSession () {
    return this.getArticleSession()
  }

  _isPropertyRequired (type, propertyName) {
    let REQUIRED = REQUIRED_PROPERTIES[type]
    if (REQUIRED) return REQUIRED.has(propertyName)
    return false
  }
}
