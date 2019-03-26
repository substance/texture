import { documentHelpers, includes, orderBy, without, copySelection, selectionHelpers, isString } from 'substance'
import TableEditingAPI from './shared/TableEditingAPI'
import { importFigures } from './articleHelpers'
import { findParentByType } from './shared/nodeHelpers'
import renderEntity from './shared/renderEntity'
import FigurePanel from './models/FigurePanel'
import SupplementaryFile from './models/SupplementaryFile'
import { BlockFormula } from './models'
import { INTERNAL_BIBR_TYPES } from './ArticleConstants'

export default class ArticleAPI {
  constructor (editorSession, archive, config, articleSession, contextProvider) {
    this.editorSession = editorSession
    this.config = config
    this.archive = archive
    this._contextProvider = contextProvider
    this._document = editorSession.getDocument()
    // TODO: do we really need this?
    this._articleSession = articleSession
    // TODO: rethink this
    this._tableApi = new TableEditingAPI(editorSession)
  }

  getDocument () {
    return this._document
  }

  getEditorSession () {
    return this.editorSession
  }

  getSelection () {
    return this.editorSession.getSelection()
  }

  /**
   * Provides a sub-api for editing tables.
   */
  getTableAPI () {
    return this._tableApi
  }

  // TODO: how are we using this?
  // This could be part of an Editor API
  copy () {
    if (this._tableApi.isTableSelected()) {
      return this._tableApi.copySelection()
    } else {
      const sel = this.getSelection()
      const doc = this.getDocument()
      if (sel && !sel.isNull() && !sel.isCollapsed()) {
        return copySelection(doc, sel)
      }
    }
  }

  cut () {
    if (this._tableApi.isTableSelected()) {
      return this._tableApi.cut()
    } else {
      const sel = this.getSelection()
      if (sel && !sel.isNull() && !sel.isCollapsed()) {
        let snippet = this.copy()
        this.deleteSelection()
        return snippet
      }
    }
  }

  deleteSelection (options) {
    const sel = this.getSelection()
    if (sel && !sel.isNull() && !sel.isCollapsed()) {
      this.editorSession.transaction(tx => {
        tx.deleteSelection(options)
      }, { action: 'deleteSelection' })
    }
  }

  insertText (text) {
    if (this._tableApi.isTableSelected()) {
      this._tableApi.insertText(text)
    } else {
      const sel = this.getSelection()
      if (sel && !sel.isNull()) {
        this.editorSession.transaction(tx => {
          tx.insertText(text)
        }, { action: 'insertText' })
      }
    }
  }

  paste (content, options) {
    if (this._tableApi.isTableSelected()) {
      return this._tableApi.paste(content, options)
    } else {
      this.editorSession.transaction(tx => {
        tx.paste(content, options)
      }, { action: 'paste' })
      return true
    }
  }

  // TODO: a card selection is essentially a node selection
  // only in metadata view we use customType='card' instead of 'node'
  selectCard (nodeId) {
    this._setSelection(this._createCardSelection(nodeId))
  }

  selectNode (nodeId) {
    const editorSession = this.editorSession
    const doc = editorSession.getDocument()
    const node = doc.get(nodeId)
    if (node) {
      const sel = editorSession.getSelection()
      const containerPath = this._getContainerPathForNode(node)
      const surface = editorSession.surfaceManager._getSurfaceForProperty(containerPath)
      const surfaceId = surface ? surface.getId() : (sel ? sel.surfaceId : null)
      editorSession.setSelection({
        type: 'node',
        nodeId: node.id,
        containerPath,
        // TODO: we need a way to look up surfaceIds by path
        surfaceId
      })
    }
  }

  // EXPERIMENTAL need to figure out if we really need this
  // This is used by ManyRelationshipComponent (which is kind of weird)
  selectValue (path) {
    this._setSelection(this._createValueSelection(path))
  }

  selectFirstRequiredPropertyOfMetadataCard (nodeId) {
    this._setSelection(this._selectFirstRequiredPropertyOfMetadataCard(nodeId))
  }

  _appendChild (collectionPath, data) {
    this.editorSession.transaction(tx => {
      let node = tx.create(data)
      documentHelpers.append(tx, collectionPath, node.id)
    })
  }

  _deleteChild (collectionPath, child, txHook) {
    this.editorSession.transaction(tx => {
      documentHelpers.remove(tx, collectionPath, child.id)
      documentHelpers.deepDeleteNode(tx, child)
      if (txHook) {
        txHook(tx)
      }
    })
  }

  _getAppState () {
    return this._getContext().appState
  }

  _getContext () {
    return this._contextProvider.getContext()
  }

  // TODO: we need a better way to update settings
  _loadSettings (settings) {
    let appState = this._getContext().appState
    appState.settings.load(settings)
    appState._setDirty('settings')
    appState.propagateUpdates()
  }

  _moveChild (collectionPath, child, shift, txHook) {
    this.editorSession.transaction(tx => {
      let ids = tx.get(collectionPath)
      let pos = ids.indexOf(child.id)
      if (pos === -1) return
      documentHelpers.removeAt(tx, collectionPath, pos)
      documentHelpers.insertAt(tx, collectionPath, pos + shift, child.id)
      if (txHook) {
        txHook(tx)
      }
    })
  }

  _replaceFile (hrefPath, file) {
    const articleSession = this.editorSession
    const path = this.archive.addAsset(file)
    articleSession.transaction(tx => {
      tx.set(hrefPath, path)
    })
  }

  _addReference (refData) {
    this._addReferences([refData])
  }

  _addReferences (refsData) {
    this.editorSession.transaction(tx => {
      let refNodes = refsData.map(refData => documentHelpers.createNodeFromJson(tx, refData))
      refNodes.forEach(ref => {
        documentHelpers.append(tx, ['article', 'references'], ref.id)
      })
      if (refNodes.length > 0) {
        let newSelection = this._selectFirstRequiredPropertyOfMetadataCard(refNodes[0])
        tx.setSelection(newSelection)
      }
    })
  }

  // This method is used to cleanup xref targets
  // during footnote or reference removing
  _removeCorrespondingXrefs (tx, node) {
    let manager
    if (INTERNAL_BIBR_TYPES.indexOf(node.type) > -1) {
      manager = this._articleSession.getReferenceManager()
    } else if (node.type === 'footnote') {
      manager = this._articleSession.getFootnoteManager()
    } else {
      return
    }
    manager._getXrefs().forEach(xref => {
      const index = xref.refTargets.indexOf(node.id)
      if (index > -1) {
        tx.update([xref.id, 'refTargets'], { type: 'delete', pos: index })
      }
    })
  }

  _createCardSelection (nodeId) {
    return {
      type: 'custom',
      customType: 'card',
      nodeId
    }
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

  // TODO: how could we make this extensible via plugins?
  _getAvailableXrefTargets (xref) {
    let refType = xref.refType
    let manager
    switch (refType) {
      case BlockFormula.refType: {
        manager = this._articleSession.getFormulaManager()
        break
      }
      case 'fig': {
        manager = this._articleSession.getFigureManager()
        break
      }
      case 'fn': {
        // FIXME: bring back table-footnotes
        // EXPERIMENTAL:
        // the above mechanism does not work for table-footnotes
        // there we need access to the current TableFigure and get its TableFootnoteManager
        let tableFigure = findParentByType(xref, 'table-figure')
        if (tableFigure) {
          manager = tableFigure.getFootnoteManager()
        } else {
          manager = this._articleSession.getFootnoteManager()
        }
        break
      }
      case 'table-fn': {
        let tableFigure = findParentByType(xref, 'table-figure')
        if (tableFigure) {
          manager = tableFigure.getFootnoteManager()
        }
        break
      }
      case 'bibr': {
        manager = this._articleSession.getReferenceManager()
        break
      }
      case 'table': {
        manager = this._articleSession.getTableManager()
        break
      }
      case 'file': {
        manager = this._articleSession.getSupplementaryManager()
        break
      }
      default:
        throw new Error('Unsupported xref type: ' + refType)
    }
    if (!manager) return []

    let selectedTargets = xref.resolve('refTargets')
    // retrieve all possible nodes that this
    // xref could potentially point to,
    // so that we can let the user select from a list.
    let availableTargets = manager.getSortedCitables()
    let targets = availableTargets.map(target => {
      // ATTENTION: targets are not just nodes
      // but entries with some information
      return {
        selected: includes(selectedTargets, target),
        node: target,
        id: target.id
      }
    })
    // Determine broken targets (such that don't exist in the document)
    let brokenTargets = without(selectedTargets, ...availableTargets)
    if (brokenTargets.length > 0) {
      targets = targets.concat(brokenTargets.map(id => {
        return { selected: true, id }
      }))
    }
    // Makes the selected targets go to top
    targets = orderBy(targets, ['selected'], ['desc'])
    return targets
  }

  // EXPERIMENTAL
  // this is called by ManyRelationshipComponent and SingleRelationshipComponent to get
  // options for the selection
  // TODO: I am not sure if it is the right approach, trying to generalize this
  // Instead we could use dedicated Components derived from the ones from the kit
  // and use specific API to accomplish this
  _getAvailableOptions (model) {
    // HACK only suppor
    let targetTypes = Array.from(model._targetTypes)
    if (targetTypes.length !== 1) {
      throw new Error('Unsupported relationship. Expected to find one targetType')
    }
    let doc = this.getDocument()
    let targetType = targetTypes[0]
    switch (targetType) {
      case 'funder': {
        return doc.get('metadata').resolve('funders')
      }
      case 'organisation': {
        return doc.get('metadata').resolve('organisations')
      }
      case 'group': {
        return doc.get('metadata').resolve('groups')
      }
      default:
        throw new Error('Unsupported relationship: ' + targetType)
    }
  }

  _toggleRelationship (path, id) {
    this.editorSession.transaction(tx => {
      let ids = tx.get(path)
      let idx = ids.indexOf(id)
      if (idx === -1) {
        tx.update(path, { type: 'insert', pos: ids.length, value: id })
      } else {
        tx.update(path, { type: 'delete', pos: idx, value: id })
      }
      tx.setSelection(this._createValueSelection(path))
    })
  }

  _toggleXrefTarget (xref, targetId) {
    let targetIds = xref.refTargets
    let index = targetIds.indexOf(targetId)
    if (index >= 0) {
      this.editorSession.transaction(tx => {
        tx.update([xref.id, 'refTargets'], { type: 'delete', pos: index })
      })
    } else {
      this.editorSession.transaction(tx => {
        tx.update([xref.id, 'refTargets'], { type: 'insert', pos: targetIds.length, value: targetId })
      })
    }
  }

  _isFieldRequired (path) {
    // ATTENTION: this API is experimental
    let settings = this._getAppState().settings
    let valueSettings = settings.getSettingsForValue(path)
    return Boolean(valueSettings['required'])
  }

  // ATTENTION: this only works for meta-data cards, thus the special naming
  _selectFirstRequiredPropertyOfMetadataCard (node) {
    if (isString(node)) {
      node = this.getDocument().get(node)
    }
    let prop = this._getFirstRequiredProperty(node)
    if (prop) {
      if (prop.isText() || prop.type === 'string') {
        let path = [node.id, prop.name]
        return {
          type: 'property',
          path,
          startOffset: 0,
          surfaceId: this._getSurfaceId(node, prop.name, 'metadata')
        }
      } else if (prop.isContainer()) {
        let nodes = node.resolve(prop.name)
        let first = nodes[0]
        if (first && first.isText()) {
          let path = first.getPath()
          return {
            type: 'property',
            path,
            startOffset: 0,
            surfaceId: this._getSurfaceId(node, prop.name, 'metadata')
          }
        }
      }
    }
    // otherwise fall back to 'card' selection
    return this._createCardSelection(node.id)
  }

  _getFirstRequiredProperty (node) {
    // TODO: still not sure if this is the right approach
    // Maybe it would be simpler to just use configuration
    // and fall back to 'node' or 'card' selection otherwise
    let schema = node.getSchema()
    for (let p of schema) {
      if (p.name === 'id' || !this._isFieldRequired([node.type, p.name])) continue
      return p
    }
  }

  _setSelection (sel) {
    this.editorSession.setSelection(sel)
  }

  // TODO: can we improve this?
  // Here we would need a transaction on archive level, creating assets, plus placing them inside the article body.
  _insertFigures (files) {
    const articleSession = this.editorSession
    let paths = files.map(file => {
      return this.archive.addAsset(file)
    })
    let sel = articleSession.getSelection()
    if (!sel || !sel.containerPath) return
    articleSession.transaction(tx => {
      importFigures(tx, sel, files, paths)
    })
  }

  _insertSupplementaryFile (file, url) {
    const articleSession = this.editorSession
    if (file) url = this.archive.addAsset(file)
    let sel = articleSession.getSelection()
    articleSession.transaction(tx => {
      let containerPath = sel.containerPath
      let nodeData = SupplementaryFile.getTemplate()
      nodeData.mimetype = file ? file.type : ''
      nodeData.href = url
      nodeData.remote = !file
      let supplementaryFile = documentHelpers.createNodeFromJson(tx, nodeData)
      tx.insertBlockNode(supplementaryFile)
      selectionHelpers.selectNode(tx, supplementaryFile.id, containerPath)
    })
  }

  _replaceSupplementaryFile (file, supplementaryFile) {
    const articleSession = this.editorSession
    const path = this.archive.addAsset(file)
    articleSession.transaction(tx => {
      const mimeData = file.type.split('/')
      tx.set([supplementaryFile.id, 'mime-subtype'], mimeData[1])
      tx.set([supplementaryFile.id, 'mimetype'], mimeData[0])
      tx.set([supplementaryFile.id, 'href'], path)
    })
  }

  _insertInlineGraphic (file) {
    const articleSession = this.editorSession
    const href = this.archive.addAsset(file)
    const mimeType = file.type
    const sel = articleSession.getSelection()
    if (!sel) return
    articleSession.transaction(tx => {
      const node = tx.create({
        type: 'inline-graphic',
        mimeType,
        href
      })
      tx.insertInlineNode(node)
      tx.setSelection(node.getSelection())
    })
  }

  _renderEntity (entity, options) {
    let exporter = this.config.getExporter('html')
    return renderEntity(entity, exporter)
  }

  // Internal API where I do not have a better solution yet

  _addFigurePanel (figureId, file) {
    const doc = this.getDocument()
    const figure = doc.get(figureId)
    const pos = figure.getCurrentPanelIndex()
    const href = this.archive.addAsset(file)
    const insertPos = pos + 1
    // NOTE: with this method we are getting the structure of the active panel
    // to replicate it, currently only for metadata fields
    const panelTemplate = figure.getTemplateFromCurrentPanel()
    this.editorSession.transaction(tx => {
      let template = FigurePanel.getTemplate()
      template.content.href = href
      template.content.mimeType = file.type
      Object.assign(template, panelTemplate)
      let node = documentHelpers.createNodeFromJson(tx, template)
      documentHelpers.insertAt(tx, [figure.id, 'panels'], insertPos, node.id)
      tx.set([figure.id, 'state', 'currentPanelIndex'], insertPos)
    })
  }

  _switchFigurePanel (figure, newPanelIndex) {
    const editorSession = this.editorSession
    let sel = editorSession.getSelection()
    if (!sel.isNodeSelection() || sel.getNodeId() !== figure.id) {
      this.selectNode(figure.id)
    }
    editorSession.updateNodeStates([[figure.id, { currentPanelIndex: newPanelIndex }]], { propagate: true })
  }

  _getContainerPathForNode (node) {
    let last = node.getXpath()
    let prop = last.property
    let prev = last.prev
    if (prev && prop) {
      return [prev.id, prop]
    }
  }

  // EXPERIMENTAL: trying to derive a surfaceId for a property in a specific node
  // exploiting knowledge about the implemented view structure: in metadata every node is top-level (card)
  // in manuscript it is either top-level (title, abstract) or part of a container (body)
  _getSurfaceId (node, propertyName, viewName) {
    if (viewName === 'metadata') {
      return `${node.id}.${propertyName}`
    } else {
      let xpath = node.getXpath().toArray()
      let idx = xpath.findIndex(entry => entry.id === 'body')
      let relXpath
      if (idx >= 0) {
        relXpath = xpath.slice(idx)
      } else {
        relXpath = xpath.slice(-1)
      }
      // the 'trace' is concatenated using '/' and the property name appended via '.'
      return relXpath.map(e => e.id).join('/') + '.' + propertyName
    }
  }
}
