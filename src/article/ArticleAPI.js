import { without } from 'substance'

import {
  AbstractAPI, DynamicCollection,
  StringModel, TextModel, FlowContentModel
} from '../kit'

import ContribsModel from './models/ContribsModel'
import MetaModel from './models/MetaModel'
import renderEntity from './shared/renderEntity'
import TranslateableModel from './models/TranslateableModel'

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

  getModelById (id) {
    let node = this.article.get(id)
    if (node) {
      // now check if there is a custom model for this type
      let ModelClass = this.modelRegistry[node.type]
      // TODO: we could go and check if there is a component
      // registered for any of the parent types
      if (!ModelClass) {
        let superTypes = node.getSchema().getSuperTypes()
        for (let superType of superTypes) {
          ModelClass = this.modelRegistry[superType]
          if (ModelClass) break
        }
      }
      if (ModelClass) {
        return new ModelClass(this, node)
      }
      let model = this._getModelForNode(node)
      if (model) {
        return model
      }
    }
  }

  _getNode (nodeId) {
    return this.article.get(nodeId)
  }

  getEntitiesByType (type) {
    // TODO: this needs to be done in a different way:
    // nodes have specific place now, e.g. 'author' nodes are located in 'authors'
    // That means rather than using the general 'type' index we should get the appropriate collection
    // let entityIds = this.article.findByType(type)
    // return entityIds.map(entityId => this._getModelById(entityId))
    return []
  }

  // TODO: this should be configurable. As it is similar to HTML conversion
  // we could use the converter registry for this
  renderEntity (model) {
    let entity = this.getArticle().get(model.id)
    return renderEntity(entity)
  }

  getArticle () {
    return this.article
  }

  getArticleSession () {
    return this.articleSession
  }

  addItemToCollection (item, collection) {
    this.articleSession.transaction(tx => {
      let node = tx.create(item)
      tx.get(collection._node.id).appendChild(tx.get(node.id))
      tx.selection = null
    })
  }

  removeItemFromCollection (item, collection) {
    this.articleSession.transaction(tx => {
      tx.get(collection._node.id).removeChild(tx.get(item.id))
      tx.delete(item.id)
      tx.selection = null
    })
  }

  addAuthor (person = {}) {
    this._addPerson(person, 'authors')
  }

  addEditor (person = {}) {
    this._addPerson(person, 'editors')
  }

  _addPerson (person = {}, type) {
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

  getAuthors () {
    return this._getPersons('authors')
  }

  getAuthorsModel () {
    return this.getModel('authors')
  }

  getEditors () {
    return this._getPersons('editors')
  }

  _getPersons (prop) {
    // TODO: authors and editors are now in article/metadata/authors and article/metadata/editors
    return []
  }

  deleteAuthor (personId) {
    return this._deletePerson(personId, 'authors')
  }

  deleteEditor (personId) {
    return this._deletePerson(personId, 'editors')
  }

  _deletePerson (personId, type) {
    // FIXME: persons are now in a different place
    // let node
    // this.articleSession.transaction((tx) => {
    //   node = tx.delete(personId)
    //   const articleRecord = tx.get('article-record')
    //   let pos = articleRecord[type].indexOf(personId)
    //   if (pos !== -1) {
    //     tx.update(['article-record', type], { type: 'delete', pos: pos })
    //   }
    //   tx.selection = null
    // })
    // return this.getModel(node.type, node)
  }

  addReferences (refs) {
    const refContribProps = ['authors', 'editors', 'inventors', 'sponsors', 'translators']
    const articleSession = this.articleSession
    articleSession.transaction(tx => {
      const refList = tx.find('ref-list')
      refs.forEach(ref => {
        refContribProps.forEach(propName => {
          if (ref[propName]) {
            let refContribs = ref[propName].map(contrib => {
              contrib.type = 'ref-contrib'
              const node = tx.create(contrib)
              return node.id
            })
            ref[propName] = refContribs
          }
        })
        const node = tx.create(ref)
        const refEl = tx.createElement('ref').attr('rid', node.id)
        refList.append(refEl)
      })
      tx.selection = null
    })
  }

  deleteReference (item, collection) {
    const articleSession = this.articleSession
    articleSession.transaction(tx => {
      const xrefIndex = tx.getIndex('xrefs')
      const xrefs = xrefIndex.get(item.id)
      tx.get(collection._node.id).removeChild(tx.get(item.id))
      xrefs.forEach(xrefId => {
        let xref = tx.get(xrefId)
        let idrefs = xref.attr('rid').split(' ')
        idrefs = without(idrefs, item.id)
        xref.setAttribute('rid', idrefs.join(' '))
      })
      tx.delete(item.id)
      tx.selection = null
    })
  }

  /*
    @return {StringModel} Model for the language code of article's main language
  */
  getOriginalLanguageCode () {
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

  getSchema (type) {
    return this.article.getSchema().getNodeSchema(type)
  }

  getArticleTitle () {
    let titleNode = this.getArticle().get('title')
    return new TextModel(this, titleNode.getPath())
  }

  getArticleAbstract () {
    let abstract = this.getArticle().get('abstract')
    return new FlowContentModel(this, abstract.getContentPath())
  }

  getArticleBody () {
    let body = this.getArticle().get('body')
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
    // TODO: this should return a Model for article.get('footnotes')
    return []
  }

  getFigures () {
    let figs = this.getArticle().get('body').findAll('fig')
    return figs.map(fig => this.getModel(fig.type, fig))
  }

  getTranslatables () {
    const translatableItems = ['title', 'abstract']
    const article = this.getArticle()
    const models = translatableItems.map(item => new TranslateableModel(this, article.get(item)))
    return models
  }

  addTranslation (model, languageCode) {
    const isText = model._node.isText()
    const articleSession = this.articleSession
    articleSession.transaction(tx => {
      let item = {
        language: languageCode
      }
      if (isText) {
        item.type = 'text-translation'
      } else {
        item.type = 'container-translation'
      }
      let node = tx.create(item)
      // HACK: trying to avoid selection errors of empty container
      if (!isText) node.append(tx.create({type: 'p'}))
      let length = tx.get([model.id, 'translations']).length
      tx.update([model.id, 'translations'], { type: 'insert', pos: length, value: node.id })
      tx.selection = null
    })
  }

  deleteTranslation (translatableModel, translationModel) {
    const articleSession = this.articleSession
    articleSession.transaction(tx => {
      let translatable = tx.get(translatableModel.id)
      let pos = translatable.translations.indexOf(translationModel.id)
      if (pos !== -1) {
        tx.update([translatableModel.id, 'translations'], { type: 'delete', pos: pos })
      }
      tx.delete(translationModel.id)
      tx.selection = null
    })
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
