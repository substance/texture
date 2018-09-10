import { without, selectionHelpers } from 'substance'
import {
  DynamicCollection,
  StringModel, TextModel, FlowContentModel,
  EditorAPI, InternalEditingAPI
} from '../kit'
import renderEntity from './shared/renderEntity'
import TranslateableModel from './models/TranslateableModel'
import { REQUIRED_PROPERTIES } from './ArticleConstants'
import TableEditingAPI from './shared/TableEditingAPI'
import { generateTable } from './shared/tableHelpers'

// TODO: this should come from configuration
const COLLECTIONS = {
  'author': 'authors',
  'editor': 'editors'
}

export default class ArticleAPI extends EditorAPI {
  constructor (articleSession, config, archive) {
    super()
    this.config = config
    this.modelRegistry = config.getModelRegistry()
    this.articleSession = articleSession
    this.article = articleSession.getDocument()
    this.archive = archive
    this._tableApi = new TableEditingAPI(articleSession)
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

  // TODO: this should be configurable. As it is similar to HTML conversion
  // we could use the converter registry for this
  renderEntity (model) {
    let entity = this.getArticle().get(model.id)
    let exporter = this.config.getExporter('html')
    return renderEntity(entity, exporter)
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
      tx.get(collection._node.id).appendChild(node)
      let newSelection = this._selectFirstRequiredProperty(node)
      tx.setSelection(newSelection)
    })
  }

  addItemsToCollection (items, collection) {
    if (items.length === 0) return
    this.articleSession.transaction(tx => {
      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        let node = tx.create(item)
        tx.get(collection._node.id).appendChild(node)
        // put the cursor into the first item
        // TODO: or should it be the last one?
        if (i === 0) {
          let newSelection = this._selectFirstRequiredProperty(node)
          tx.setSelection(newSelection)
        }
      }
    })
  }

  removeItemFromCollection (item, collection) {
    this.articleSession.transaction(tx => {
      tx.get(collection._node.id).removeChild(tx.get(item.id))
      tx.delete(item.id)
      tx.selection = null
    })
  }

  moveCollectionItem (collection, from, to) {
    this.articleSession.transaction(tx => {
      let colNode = tx.get(collection._node.id)
      let item = colNode.getChildAt(from)
      colNode.removeAt(from)
      colNode.insertAt(to, item)
    })
  }

  getAuthorsModel () {
    return this.getModel('authors')
  }

  addReferences (items, collection) {
    const refContribProps = ['authors', 'editors', 'inventors', 'sponsors', 'translators']
    const articleSession = this.articleSession
    articleSession.transaction(tx => {
      let refs = tx.get(collection._node.id)
      items.forEach((item, i) => {
        refContribProps.forEach(propName => {
          if (item[propName]) {
            let refContribs = item[propName].map(contrib => {
              contrib.type = 'ref-contrib'
              const node = tx.create(contrib)
              return node.id
            })
            item[propName] = refContribs
          }
        })

        let node = tx.create(item)
        refs.appendChild(tx.get(node.id))
        if (i === 0) {
          let newSelection = this._selectFirstRequiredProperty(node)
          tx.setSelection(newSelection)
        }
      })
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

  addXrefTarget (targetId, model) {
    const articleSession = this.articleSession
    articleSession.transaction(tx => {
      const xref = tx.get(model.id)
      let targets = xref.getAttribute('rid').split(' ')
      targets.push(targetId)
      xref.setAttribute('rid', targets.join(' '))
    })
  }

  removeXrefTarget (targetId, model) {
    const articleSession = this.articleSession
    articleSession.transaction(tx => {
      const xref = tx.get(model.id)
      let targets = xref.getAttribute('rid').split(' ')
      let idx = targets.indexOf(targetId)
      targets.splice(idx, 1)
      xref.setAttribute('rid', targets.join(' '))
    })
  }

  _getContext () {
    return this._context
  }

  /* Low-level content editing API */

  copy () {
    if (this._tableApi.isTableSelected()) {
      return this._tableApi.copySelection()
    } else {
      return super.copy()
    }
  }

  paste (content, options) {
    if (this._tableApi.isTableSelected()) {
      return this._tableApi.paste(content, options)
    } else {
      return super.paste(content, options)
    }
  }

  insertText (text) {
    if (this._tableApi.isTableSelected()) {
      this._tableApi.insertText(text)
    } else {
      return super.insertText(text)
    }
  }

  _createTextNode (tx, container, text) {
    // TODO: for Container nodes we should define the default text type
    // maybe even via a schema attribute
    return tx.create({ type: 'p', content: text })
  }

  _createListNode (tx, container, params) {
    let el = tx.create({ type: 'list' })
    if (params.listType) {
      el.attr('list-type', params.listType)
    }
    return el
  }

  getTableAPI () {
    return this._tableApi
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

  _getEditorSession () {
    return this.articleSession
  }

  _isPropertyRequired (type, propertyName) {
    let REQUIRED = REQUIRED_PROPERTIES[type]
    if (REQUIRED) return REQUIRED.has(propertyName)
    return false
  }

  _selectFirstRequiredProperty (node) {
    let requiredProps = REQUIRED_PROPERTIES[node.type]
    if (requiredProps) {
      let propName = Array.from(requiredProps)[0]
      let path = [node.id, propName]
      return {
        type: 'property',
        path,
        startOffset: 0,
        surfaceId: `${path.join('.')}`
      }
    }
  }

  // TODO: can we improve this?
  // 1. Here we would need a transaction on archive level, creating assets, plus placing them inside the article body.
  // 2. It would be interesting to use a more generic interface maybe even JATS
  // TODO: Use JATS snippet for figure creation
  _insertFigures (files) {
    const articleSession = this.articleSession
    let LAST = files.length - 1
    let paths = files.map(file => {
      return this.archive.createFile(file)
    })
    let sel = articleSession.getSelection()
    if (!sel || !sel.containerId) return
    let containerId = sel.containerId
    articleSession.transaction(tx => {
      files.map((file, idx) => {
        let path = paths[idx]
        let mimeData = file.type.split('/')
        let caption = tx.createElement('caption').append(
          tx.createElement('p')
        )
        let graphic = tx.createElement('graphic').attr({
          'mime-subtype': mimeData[1],
          'mimetype': mimeData[0],
          'xlink:href': path
        })
        let permission = tx.create({
          type: 'permission'
        })
        let figure = tx.create({
          type: 'figure',
          caption: caption.id,
          content: graphic.id,
          permission: permission.id
        })
        tx.insertBlockNode(figure)
        if (idx === LAST) {
          selectionHelpers.selectNode(tx, figure.id, containerId)
        }
      })
    })
  }

  // TODO: Use JATS snippet for table creation
  _createTableFigure (tx, params) {
    let caption = tx.createElement('caption').append(
      tx.createElement('p')
    )
    let permission = tx.create({
      type: 'permission'
    })
    let table = generateTable(tx, params.rows, params.columns)
    let tableFigure = tx.create({
      type: 'table-figure',
      caption: caption.id,
      content: table.id,
      permission: permission.id
    })

    return tableFigure
  }

  _insertFootnote (item, footnotes) {
    this.articleSession.transaction(tx => {
      let node = tx.create(item)
      let p = tx.create({type: 'p'})
      node.append(p)
      tx.get(footnotes._node.id).appendChild(node)
      let path = [p.id, 'content']
      let newSelection = {
        type: 'property',
        path,
        startOffset: 0,
        surfaceId: node.id
      }
      tx.setSelection(newSelection)
    })
  }

  _insertPerson (person, collection) {
    const collectionId = collection.id
    this.articleSession.transaction(tx => {
      let bio = tx.create({type: 'bio'}).append(
        tx.create({type: 'p'})
      )
      person.bio = bio.id
      let node = tx.create(person)
      tx.get(collectionId).appendChild(node)
      let newSelection = this._selectFirstRequiredProperty(node)
      tx.setSelection(newSelection)
    })
  }

  _getSelection () {
    return this.articleSession.editorState.selection
  }

  _setSelection (selData) {
    this.articleSession.setSelection(selData)
  }

  _createInternalEditorAPI () {
    return new InternalArticleEditingAPI()
  }
}

class InternalArticleEditingAPI extends InternalEditingAPI {
  createTextNode (tx, container, text) {
    // TODO: for Container nodes we should define the default text type
    // maybe even via a schema attribute
    return tx.create({ type: 'p', content: text })
  }

  createListNode (tx, container, params) {
    let el = tx.create({ type: 'list' })
    if (params.listType) {
      el.attr('list-type', params.listType)
    }
    return el
  }
}
