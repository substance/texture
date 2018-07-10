// NOTE: Rewriting former EditorSession.
// Now the EditorSession acts only as an interface to an EditorState
// part of the overall Application state
import {
  isPlainObject, Selection, ChangeHistory, Transaction,
  operationHelpers, isString
} from 'substance'

export default class TextureEditorSession {
  constructor (editorState, config) {
    this.editorState = editorState
    this.config = config

    const doc = editorState.get('document')
    if (!doc) throw new Error('EditorState must have a document instance')

    this._transaction = new Transaction(doc)
    // HACK: we want `tx.setSelection()` to add surfaceId to the selection
    // automatically, so that tx is easier to use.
    _patchTxSetSelection(this._transaction, this)

    // TODO: in future we want to control the change history on a higher level
    // e.g. to be able to have a common history across multiple documents
    this._history = new ChangeHistory()

    // TODO: we should rethink which of these are ok to be managed on Editor level
    // and which should maybe go into a different place
    const SurfaceManager = config.getSurfaceManagerClass()
    const GlobalEventHandler = config.getGlobalEventHandlerClass()
    const KeyboardManager = config.getKeyboardManagerClass()
    const MarkersManager = config.getMarkersManagerClass()
    this.surfaceManager = new SurfaceManager(this)
    this.markersManager = new MarkersManager(this)
    this.globalEventHandler = new GlobalEventHandler(this, this.surfaceManager)
    // FIXME: we should change how context
    this.keyboardManager = new KeyboardManager(this, config.getKeyboardShortcuts(), {})
  }

  getConfigurator () {
    return this.config
  }

  getDocument () {
    return this.editorState.get('document')
  }

  getSelection () {
    return this.editorState.get('selection')
  }

  getSelectionState () {
    return this.editorState.get('selectionState')
  }

  getCommandStates () {
    return this.editorState.get('commandStates')
  }

  getChange () {
    console.error("DEPRECATED: use editorState.getUpdate('document') instead")
    let update = this.editorState.getUpdate('document')
    if (update) return update.change
  }

  getChangeInfo () {
    console.error("DEPRECATED: use editorState.getUpdate('document') instead")
    let update = this.editorState.getUpdate('document')
    if (update) return update.info
  }

  getFocusedSurface () {
    return this.surfaceManager.getFocusedSurface()
  }

  getSurface (surfaceId) {
    return this.surfaceManager.getSurface(surfaceId)
  }

  getManager () {
    console.error('BROKEN: editorSession.getManager() has been removed')
  }

  getEditor () {
    console.error('BROKEN: editorSession.getEditor() has been removed')
  }

  getLanguage () {
    console.error("DEPRECATED: use editorState.get('lang') instead")
    return this.editorState.get('lang')
  }

  getTextDirection () {
    console.error("DEPRECATED: use editorState.get('dir') instead")
    return this.editorState.get('dir')
  }

  isBlurred () {
    console.error("DEPRECATED: use editorState.get('blurred') instead")
    return Boolean(this.editorState.get('blurred'))
  }

  hasChanged (resource) {
    console.error(`DEPRECATED: use editorState.isDirty('${resource}') instead`)
    return this.editorState.isDirty(resource)
  }

  canUndo () {
    return this._history.canUndo()
  }

  canRedo () {
    return this._history.canRedo()
  }

  /*
    There are cases when we want to explicitly reset the change history of
    an editor session
  */
  resetHistory () {
    this._history.reset()
    this._setDirty('commandStates')
    if (!this._flowing) {
      this.startFlow()
    }
  }

  // TODO: try to cut this down to what we really need
  setSelection (sel, skipFlow) {
    // console.log('EditorSession.setSelection()', sel)
    if (sel && isPlainObject(sel)) {
      sel = this.getDocument().createSelection(sel)
    }
    if (sel && !sel.isNull()) {
      if (!sel.surfaceId) {
        let fs = this.getFocusedSurface()
        if (fs) {
          sel.surfaceId = fs.id
        }
      }
    }
    _addSurfaceId(sel, this)
    _addContainerId(sel, this)
    sel = this._setSelection(sel)
    this.startFlow()
    return sel
  }

  selectNode (nodeId) {
    let surface = this.getFocusedSurface()
    this.setSelection({
      type: 'node',
      nodeId: nodeId,
      containerId: surface.getContainerId(),
      surfaceId: surface.id
    })
  }

  setLanguage (lang) {
    console.error("DEPRECATED: use editorState.set('lang') instead")
    this.editorState.set('lang', lang)
    this.startFlow()
  }

  setTextDirection (dir) {
    console.error("DEPRECATED: use editorState.set('dir') instead")
    this.editorState.set('dir', dir)
    this.startFlow()
  }

  setCommandStates (commandStates) {
    console.error("DEPRECATED: use editorState.set('commandStates') instead")
    // HACK: there is a deficiency in SchemaDrivenCommandManager starting
    // a double reflow
    this.editorState.set('commandStates', commandStates)
  }

  setSaveHandler () {
    console.error('BROKEN: editorSession.setSaveHandler() has been removed')
  }

  createSelection () {
    const doc = this.getDocument()
    return doc.createSelection.apply(doc, arguments)
  }

  /**
    Start a transaction to manipulate the document

    @param {function} transformation a function(tx) that performs actions on the transaction document tx

    @example

    ```js
    doc.transaction(function(tx, args) {
      tx.update(...)
      ...
      tx.setSelection(newSelection)
    })
    ```
  */
  transaction (transformation, info) {
    const t = this._transaction
    info = info || {}
    t._sync()
    let change = t._recordChange(transformation, this.getSelection(), info)
    if (change) {
      this._commit(change, info)
    } else {
      // if no changes, at least update the selection
      this._setSelection(this._transaction.getSelection())
      this.startFlow()
    }
    return change
  }

  undo () {
    this._undoRedo('undo')
  }

  redo () {
    this._undoRedo('redo')
  }

  onUpdate (...args) {
    // console.error('DEPRECATED: use EditorState API')
    return this._registerObserver('update', args)
  }

  onPreRender (...args) {
    // console.error('DEPRECATED: use EditorState API')
    return this._registerObserver('pre-render', args)
  }

  onRender (...args) {
    // console.error('DEPRECATED: use EditorState API')
    return this._registerObserver('render', args)
  }

  onPostRender (...args) {
    // console.error('DEPRECATED: use EditorState API')
    return this._registerObserver('post-render', args)
  }

  onPosition (...args) {
    // console.error('DEPRECATED: use EditorState API')
    return this._registerObserver('position', args)
  }

  onFinalize (...args) {
    // console.error('DEPRECATED: use EditorState API')
    return this._registerObserver('finalize', args)
  }

  on (stage, ...args) {
    // console.error('DEPRECATED: use EditorState API')
    return this._registerObserver(stage, args)
  }

  off (observer) {
    // console.error('DEPRECATED: use EditorState API')
    this.editorState.removeObserver(observer)
  }

  _registerObserver (stage, args) {
    let resource, handler, observer, opts
    if (!isString(args[0])) {
      ([handler, observer, opts] = args)
      resource = '@any'
    } else {
      ([resource, handler, observer, opts] = args)
    }
    let options = { stage }
    if (opts) options[resource] = opts
    this.editorState.addObserver([resource], handler, observer, options)
  }

  _setSelection (sel) {
    const doc = this.getDocument()
    if (!sel) {
      sel = Selection.nullSelection
    } else {
      sel.attach(doc)
    }
    this.editorState.set('selection', sel)
    return sel
  }

  // HACK: Allows to immitate a document change
  _setUpdate (name, update) {
    this.editorState._setUpdate(name, update)
  }

  _undoRedo (which) {
    const doc = this.getDocument()
    var from, to
    if (which === 'redo') {
      from = this._history.undoneChanges
      to = this._history.doneChanges
    } else {
      from = this._history.doneChanges
      to = this._history.undoneChanges
    }
    var change = from.pop()
    if (change) {
      this._applyChange(change, {})
      this._transaction.__applyChange__(change)
      // move change to the opposite change list (undo <-> redo)
      to.push(doc.invert(change))
      // use selection from change
      let sel = change.after.selection
      if (sel) sel.attach(doc)
      this._setSelection(sel)
      // finally trigger the flow
      this.startFlow()
    } else {
      console.warn('No change can be %s.', (which === 'undo' ? 'undone' : 'redone'))
    }
  }

  _transformLocalChangeHistory (externalChange) {
    // Transform the change history
    // Note: using a clone as the transform is done inplace
    // which is ok for the changes in the undo history, but not
    // for the external change
    var clone = {
      ops: externalChange.ops.map(function (op) { return op.clone() })
    }
    operationHelpers.transformDocumentChange(clone, this._history.doneChanges)
    operationHelpers.transformDocumentChange(clone, this._history.undoneChanges)
  }

  _transformSelection (change) {
    var oldSelection = this.getSelection()
    var newSelection = operationHelpers.transformSelection(oldSelection, change)
    // console.log('Transformed selection', change, oldSelection.toString(), newSelection.toString())
    return newSelection
  }

  _commit (change, info) {
    this._commitChange(change, info)
    // TODO: Not sure this is the best place to mark the session dirty
    this._hasUnsavedChanges = true
    this.startFlow()
  }

  _commitChange (change, info) {
    change.timestamp = Date.now()
    this._applyChange(change, info)
    if (info['history'] !== false && !info['hidden']) {
      let inverted = this.getDocument().invert(change)
      this._history.push(inverted)
    }
    var newSelection = change.after.selection || Selection.nullSelection
    // HACK injecting the surfaceId here...
    // TODO: we should find out where the best place is to do this
    if (!newSelection.isNull() && !newSelection.surfaceId) {
      newSelection.surfaceId = change.after.surfaceId
    }
    this._setSelection(newSelection)
  }

  _applyChange (change, info) {
    if (!change) {
      console.error('FIXME: change is null.')
      return
    }
    const doc = this.getDocument()
    doc._apply(change)
    doc._notifyChangeListeners(change, info)
    this.editorState._setUpdate('document', { change, info })
  }

  _applyRemoteChange (change) {
    // console.log('EditorSession: applying remote change');
    if (change.ops.length > 0) {
      this._applyChange(change, { remote: true })
      // update the 'stage' and the undo-history too
      this._transaction.__applyChange__(change)
      this._transformLocalChangeHistory(change)
      this._setSelection(this._transformSelection(change))
      this.startFlow()
    }
  }

  hasUnsavedChanges () {
    return this._hasUnsavedChanges
  }

  startFlow () {
    this.editorState.propagateUpdates()
  }

  _setDirty (resource) {
    this.editorState._setDirty(resource)
  }
}

function _patchTxSetSelection (tx, editorSession) {
  tx.setSelection = function (sel) {
    sel = Transaction.prototype.setSelection.call(tx, sel)
    _addSurfaceId(sel, editorSession)
    _addContainerId(sel, editorSession)
    return sel
  }
}

/*
  Complements selection data according to the given Editor state.
  I.e., if no
*/
function _addSurfaceId (sel, editorSession) {
  if (sel && !sel.isNull() && !sel.surfaceId) {
    // TODO: We could check if the selection is valid within the given surface
    let surface = editorSession.getFocusedSurface()
    if (surface) {
      sel.surfaceId = surface.id
    }
  }
}

function _addContainerId (sel, editorSession) {
  if (sel && !sel.isNull() && sel.surfaceId && !sel.containerId) {
    let surface = editorSession.getSurface(sel.surfaceId)
    if (surface) {
      let containerId = surface.getContainerId()
      if (containerId) {
        sel.containerId = containerId
      }
    }
  }
}
