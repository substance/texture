// NOTE: Rewriting former EditorSession.
// Now the EditorSession acts only as an interface to an EditorState
// part of the overall Application state
import {
  isPlainObject, Selection, operationHelpers, isString
} from 'substance'

import EditorState from './EditorState'
import SurfaceManager from './SurfaceManager'
import MarkersManager from './MarkersManager'
import GlobalEventHandler from './GlobalEventHandler'
import KeyboardManager from './KeyboardManager'
import CommandManager from './CommandManager'

export default function (DocumentSession) {
  class EditorSession extends DocumentSession {
    constructor (doc, config, contextProvider, initialState = {}) {
      super(doc, config)

      if (!contextProvider) contextProvider = { context: { editorSession: this } }

      this.config = config
      this.contextProvider = contextProvider

      let editorState = new EditorState(Object.assign({
        document: doc,
        selection: Selection.nullSelection,
        selectionState: {},
        focusedSurface: null,
        commandStates: {},
        hasUnsavedChanges: false,
        isBlurred: false,
        overlayId: null
      }, initialState))
      let surfaceManager = new SurfaceManager(editorState)
      let markersManager = new MarkersManager(editorState)
      let globalEventHandler = new GlobalEventHandler(editorState)
      let keyboardManager = new KeyboardManager(config.getKeyboardShortcuts(), (commandName) => {
        return this.executeCommand(commandName)
      }, contextProvider)
      let commandManager = new CommandManager(editorState,
        // update commands when document or selection have changed
        ['document', 'selection'],
        config.getCommands(),
        contextProvider
      )

      this.editorState = editorState
      this.surfaceManager = surfaceManager
      this.markersManager = markersManager
      this.globalEventHandler = globalEventHandler
      this.keyboardManager = keyboardManager
      this.commandManager = commandManager

      doc.on('document:changed', this._onDocumentChange, this)
    }

    dispose () {
      this.getDocument().off(this)
    }

    initialize () {
      // TODO: is this the right place?
      // initial reduce step
      this.commandManager.reduce()
    }

    getConfigurator () {
      return this.config
    }

    getContext () {
      return this.contextProvider.context
    }

    getSelection () {
      return this.editorState.selection
    }

    getSelectionState () {
      return this.editorState.selectionState
    }

    getCommandStates () {
      return this.editorState.commandStates
    }

    getFocusedSurface () {
      return this.editorState.focusedSurface
    }

    isBlurred () {
      return Boolean(this.editorState.isBlurred)
    }

    hasUnsavedChanges () {
      return Boolean(this.editorState.hasUnsavedChanges)
    }

    setSelection (sel) {
      // console.log('EditorSession.setSelection()', sel)
      if (!sel) sel = Selection.nullSelection
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
      this.editorState.selection = sel
      this.editorState.propagateUpdates()
      return sel
    }

    transaction (fn, info) {
      const editorState = this.editorState
      let tx = this._transaction.tx
      // HACK: setting the state of 'tx' here
      // TODO: find out a way to pass a tx state for the transaction
      // then we could derive this state from the editorState
      let selBefore = editorState.selection
      tx.selection = selBefore
      let change = this._recordChange(fn, info)
      if (change) {
        let selAfter = tx.selection
        this._setSelection(selAfter)
        change.before = { selection: selBefore }
        change.after = { selection: selAfter }
        // console.log('EditorSession.transaction()', change)
        this._commit(change, info)
        editorState.propagateUpdates()
      }
      return change
    }

    undo () {
      let change = super.undo()
      if (change) this._setSelection(change.after.selection)
      this.editorState.propagateUpdates()
    }

    redo () {
      let change = super.redo()
      if (change) this._setSelection(change.after.selection)
      this.editorState.propagateUpdates()
    }

    onUpdate (...args) {
      console.error('DEPRECATED: use EditorState API')
      return this._registerObserver('update', args)
    }

    onPreRender (...args) {
      console.error('DEPRECATED: use EditorState API')
      return this._registerObserver('pre-render', args)
    }

    onRender (...args) {
      if (_shouldDisplayDeprecatedWarning()) {
        console.error('DEPRECATED: use EditorState API')
      }
      return this._registerObserver('render', args)
    }

    onPostRender (...args) {
      console.error('DEPRECATED: use EditorState API')
      return this._registerObserver('post-render', args)
    }

    onPosition (...args) {
      console.error('DEPRECATED: use EditorState API')
      return this._registerObserver('position', args)
    }

    onFinalize (...args) {
      console.error('DEPRECATED: use EditorState API')
      return this._registerObserver('finalize', args)
    }

    _onDocumentChange (change, info) {
      this.editorState._setUpdate('document', { change, info })
      this.editorState.hasUnsavedChanges = true
    }

    executeCommand (commandName) {
      this.commandManager.executeCommand(commandName)
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
      this.editorState.selection = sel
      return sel
    }

    // HACK: Allows to immitate a document change
    _setUpdate (name, update) {
      this.editorState._setUpdate(name, update)
    }

    _transformSelection (change) {
      var oldSelection = this.getSelection()
      var newSelection = operationHelpers.transformSelection(oldSelection, change)
      return newSelection
    }

    _applyRemoteChange (change) {
      // console.log('EditorSession: applying remote change');
      if (change.ops.length > 0) {
        super._applyRemoteChange(change)
        this._setSelection(this._transformSelection(change))
        this.editorState.propagateUpdates()
      }
    }
  }

  return EditorSession
}

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
    let surface = editorSession.surfaceManager.getSurface(sel.surfaceId)
    if (surface) {
      let containerId = surface.getContainerId()
      if (containerId) {
        sel.containerId = containerId
      }
    }
  }
}

const _exceptions = [
  /TextPropertyEditor.*substance\.js/,
  /IsolatedNodeComponent.*substance\.js/,
  /IsolatedInlineNodeComponent.*substance\.js/,
  /TextInput.*substance\.js/
]
function _shouldDisplayDeprecatedWarning () {
  let caller = _getCaller(2)
  for (let e of _exceptions) {
    if (e.exec(caller)) return false
  }
  return true
}

function _getCaller (level) {
  try {
    throw new Error()
  } catch (err) {
    let stack = err.stack
    let lines = stack.split(/\n/)
    let line = lines[2 + level]
    return line
  }
}
