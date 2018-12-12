import { without, documentHelpers } from 'substance'
import {
  DynamicCollection,
  StringModel, TextModel, FlowContentModel,
  EditorAPI, InternalEditingAPI
} from '../kit'
import renderEntity from './shared/renderEntity'
import TranslateableModel from './models/TranslateableModel'
import { REQUIRED_PROPERTIES } from './ArticleConstants'
import TableEditingAPI from './shared/TableEditingAPI'
import {
  createEmptyElement, importFigurePanel, importFigures,
  insertTableFigure, setContainerSelection
} from './articleHelpers'

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
    this._modelCache = new Map()
    // hook to invalidate cache
    articleSession.on('change', this._invalidateDeletedModels, this)
  }

  dispose () {
    this._modelCache.clear()
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
      let cachedModel = this._modelCache.get(node.id)
      // ATTENTION: making sure that the node is
      if (cachedModel) return cachedModel

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
      let model
      if (ModelClass) {
        model = new ModelClass(this, node)
      } else {
        model = this._getModelForNode(node)
      }
      if (model) {
        this._modelCache.set(node.id, model)
      }
      return model
    }
  }

  _invalidateDeletedModels (change) {
    for (let op of change.ops) {
      if (op.isDelete()) {
        this._modelCache.delete(op.getValue().id)
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
      let newSelection = this._selectFirstRequiredPropertyOfMetadataCard(node)
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
          let newSelection = this._selectFirstRequiredPropertyOfMetadataCard(node)
          tx.setSelection(newSelection)
        }
      }
    })
  }

  removeItemFromCollection (item, collection) {
    this.articleSession.transaction(tx => {
      let _item = tx.get(item.id)
      _item.getParent().removeChild(_item)
      // TODO: this is actually 'deepDeleteNode()' deleting owned children too
      documentHelpers.deleteNode(tx, _item)
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
          let newSelection = this._selectFirstRequiredPropertyOfMetadataCard(node)
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

  // TODO: we should use a better internal model for xref
  // instead of an attribute we should use an array property instead
  toggleXrefTarget (targetId, model) {
    const articleSession = this.articleSession
    articleSession.transaction(tx => {
      const xref = tx.get(model.id)
      let targetIds = xref.getAttribute('rid').split(' ')
      let found = false
      for (let idx = targetIds.length - 1; idx >= 0; idx--) {
        let id = targetIds[idx]
        if (!tx.get(id)) {
          targetIds.splice(idx, 1)
        }
        if (id === targetId) {
          targetIds.splice(idx, 1)
          found = true
        }
      }
      if (!found) {
        targetIds.push(targetId)
      }
      xref.setAttribute('rid', targetIds.join(' '))
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
    // TODO: to achieve a schema compliant paste we need
    // to detect the target element and 'filter' the content accordingly
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

  // EXPERIMENTAL: in the MetadataEditor we want to be able to select a full card
  // I do not want to introduce a 'card' selection as this is not an internal concept
  // and instead opting for 'model' selection.
  selectModel (modelId) {
    this._setSelection(this._createModelSelection(modelId))
  }

  _createModelSelection (modelId) {
    return {
      type: 'custom',
      customType: 'model',
      nodeId: modelId,
      data: {
        modelId
      }
    }
  }

  selectValue (path) {
    this._setSelection(this._createValueSelection(path))
  }

  _createValueSelection (path) {
    return {
      type: 'custom',
      customType: 'value',
      nodeId: path[0],
      data: {
        path,
        propertyName: path[1]
      },
      surfaceId: path[0]
    }
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

  // ATTENTION: this only works for meta-data cards, thus the special naming
  _selectFirstRequiredPropertyOfMetadataCard (node) {
    // TODO: the current way to describe required properties will not hold
    // This will most probably be very customer specific
    // To use this for selection is thus problematic
    let schema = node.getSchema()
    let requiredProps = REQUIRED_PROPERTIES[node.type]
    let propName = null
    if (requiredProps && requiredProps.size > 0) {
      // ... also this is very 'dangerous' because the defined required property might not even exist in the schema
      let _propName = Array.from(requiredProps)[0]
      // double-checking that the property actually exists
      if (!schema.getProperty(_propName)) {
        throw new Error(`property "${_propName}" does not exist for node type "${node.type}"`)
      } else {
        propName = _propName
      }
    } else {
      // take the first 'text' property from the schema
      for (let prop of schema) {
        if (prop.isText()) {
          propName = prop.name
          break
        }
      }
    }
    if (propName) {
      let path = [node.id, propName]
      return {
        type: 'property',
        path,
        startOffset: 0,
        // HACK: this does only work within the meta-data
        surfaceId: `${path.join('.')}`
      }
    } else {
      return this._createModelSelection(node.id)
    }
  }

  // TODO: can we improve this?
  // Here we would need a transaction on archive level, creating assets, plus placing them inside the article body.
  _insertFigures (files) {
    const articleSession = this.articleSession
    let paths = files.map(file => {
      return this.archive.createFile(file)
    })
    let sel = articleSession.getSelection()
    if (!sel || !sel.containerId) return
    articleSession.transaction(tx => {
      importFigures(tx, sel, files, paths)
    })
  }

  _insertFigurePanel (file, collection, index) {
    const articleSession = this.articleSession
    const path = this.archive.createFile(file)
    articleSession.transaction(tx => {
      const figurePanel = importFigurePanel(tx, file, path)
      tx.update(collection._path, { type: 'insert', pos: index + 1, value: figurePanel.id })
    })
  }

  _insertInlineGraphic (file) {
    const articleSession = this.articleSession
    const path = this.archive.createFile(file)
    const sel = articleSession.getSelection()
    if (!sel) return
    articleSession.transaction(tx => {
      const mimeData = file.type.split('/')
      const node = tx.create({ type: 'inline-graphic' })
      const inlineGraphic = tx.insertInlineNode(node)
      inlineGraphic.attr({
        'mime-subtype': mimeData[1],
        'mimetype': mimeData[0],
        'xlink:href': path
      })
      tx.setSelection({
        type: 'property',
        path: node.getPath(),
        startOffset: node.start.offset,
        endOffset: node.end.offset
      })
    })
  }

  _createTableFigure (tx, params) {
    return insertTableFigure(tx, params.rows, params.columns)
  }

  _createDispFormula (tx) {
    return createEmptyElement(tx, 'disp-formula')
  }

  _createDispQuote (tx) {
    return createEmptyElement(tx, 'disp-quote')
  }

  _insertFootnote (item, footnotes) {
    const collectionId = footnotes.id
    this.articleSession.transaction(tx => {
      const node = createEmptyElement(tx, 'footnote').append(
        tx.create({type: 'p'})
      )
      tx.get(collectionId).appendChild(
        node
      )
      setContainerSelection(tx, node)
    })
  }

  _insertTableFootnote (item, collection) {
    this.articleSession.transaction(tx => {
      const node = createEmptyElement(tx, 'footnote').append(
        tx.create({type: 'p'})
      )
      let length = tx.get([collection.id, 'footnotes']).length
      tx.update([collection.id, 'footnotes'], { type: 'insert', pos: length, value: node.id })
      // HACK: in future we want to get surfaceId properly rather then stitching it
      const surfaceId = `body/${collection.id}/${node.id}`
      setContainerSelection(tx, node, surfaceId)
    })
  }

  _removeTableFootnote (item, collection) {
    this.articleSession.transaction(tx => {
      const footnotes = tx.get([collection.id, 'footnotes'])
      let pos = footnotes.indexOf(item.id)
      if (pos !== -1) {
        tx.update([collection.id, 'footnotes'], { type: 'delete', pos: pos })
      }
      tx.delete(item.id)
      tx.selection = null
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
      let newSelection = this._selectFirstRequiredPropertyOfMetadataCard(node)
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
