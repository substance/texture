import {
  AbstractEditorSession, Selection, isPlainObject, ChangeHistoryView
} from 'substance'

import EditorState from './EditorState'
import SurfaceManager from './SurfaceManager'
import MarkersManager from './MarkersManager'
import GlobalEventHandler from './GlobalEventHandler'
import KeyboardManager from './KeyboardManager'
import SchemaDrivenCommandManager from './SchemaDrivenCommandManager'
import FindAndReplaceManager from './FindAndReplaceManager'

export default class EditorSession extends AbstractEditorSession {
  /**
   * @param {string} id a unique name for this editor session
   * @param {DocumentSession} documentSession
   * @param {Configurator} config
   * @param {object} contextProvider an object with getContext()
   * @param {object|EditorState} editorState a plain object with intial values or an EditorState instance for reuse
   */
  constructor (id, documentSession, config, contextProvider, editorState = {}) {
    super(id, documentSession, editorState.history)

    if (!contextProvider) contextProvider = { context: { editorSession: this } }

    const doc = documentSession.getDocument()

    this._config = config
    this._contextProvider = contextProvider

    // FIXME: it a little confusing how the history injection is done here
    // On the one hand, AbstractEditorSession initializes a history if not given
    // On the other, we want to reuse the history, so we put it into the created
    // editorState, so somebody can pick it up and reuse it
    // Alternatively, like we do it in ArticlePanel, the whole editorState is injected
    // with a history already initialized
    if (isPlainObject(editorState)) {
      editorState.history = this._history
      editorState = this.constructor.createEditorState(documentSession, editorState)
    } else {
      // revitalising the given editorState because it has probably been disposed
      // TODO: we should think about a general approach to hibernate an EditorSession
      // re-using the editorState is a first step towards this.
      editorState.init()
    }
    let surfaceManager = new SurfaceManager(editorState)
    let markersManager = new MarkersManager(editorState)
    let globalEventHandler = new GlobalEventHandler(editorState)
    let keyboardManager = new KeyboardManager(config.getKeyboardShortcuts(), (commandName, params) => {
      return this.executeCommand(commandName, params)
    }, contextProvider)
    let commandManager = new SchemaDrivenCommandManager(editorState,
      // update commands when document or selection have changed
      ['document', 'selection'],
      config.getCommands(),
      contextProvider
    )
    let findAndReplaceManager = new FindAndReplaceManager(this, editorState, markersManager)

    this.editorState = editorState
    this.surfaceManager = surfaceManager
    this.markersManager = markersManager
    this.globalEventHandler = globalEventHandler
    this.keyboardManager = keyboardManager
    this.commandManager = commandManager
    this.findAndReplaceManager = findAndReplaceManager

    // EXPERIMENTAL: hook that records changes triggered via node state updates
    doc.on('document:changed', this._onDocumentChange, this)
    // EXPERIMENTAL: registering a 'reducer' that resets overlayId whenever the selection changes
    editorState.addObserver(['selection'], this._resetOverlayId, this, { stage: 'update' })
  }

  initialize () {
    // TODO: is this the right place?
    // initial reduce step
    this.commandManager.reduce()
  }

  dispose () {
    this.getDocument().off(this)
    this.editorState.off(this)
    this.editorState.dispose()
  }

  static createEditorState (documentSession, initialState = {}) {
    let doc = documentSession.getDocument()
    return new EditorState(Object.assign({
      document: doc,
      history: new ChangeHistoryView(documentSession),
      selection: Selection.nullSelection,
      selectionState: {},
      focusedSurface: null,
      commandStates: {},
      hasUnsavedChanges: false,
      isBlurred: false,
      overlayId: null,
      findAndReplace: FindAndReplaceManager.defaultState()
    }, initialState))
  }

  // createSelection (...args) {
  //   return this._document.createSelection(...args)
  // }

  executeCommand (commandName, params) {
    return this.commandManager.executeCommand(commandName, params)
  }

  getCommandStates () {
    return this.editorState.commandStates
  }

  getConfigurator () {
    return this._config
  }

  getContext () {
    return this.contextProvider.context
  }

  getFocusedSurface () {
    return this.editorState.focusedSurface
  }

  getSelectionState () {
    return this.editorState.selectionState
  }

  hasUnsavedChanges () {
    return Boolean(this.editorState.hasUnsavedChanges)
  }

  isBlurred () {
    return Boolean(this.editorState.isBlurred)
  }

  setSelection (sel) {
    super.setSelection(sel)
    this.editorState.propagateUpdates()
  }

  transaction (...args) {
    super.transaction(...args)
    this.editorState.propagateUpdates()
  }

  _getSelection () {
    return this.editorState.selection
  }

  _setSelection (sel) {
    this.editorState.selection = sel
    return sel
  }

  undo () {
    super.undo()
    this.editorState.propagateUpdates()
  }

  updateNodeStates (tuples, options = {}) {
    super.updateNodeStates(tuples, options)

    if (options.propagate) {
      this.editorState.propagateUpdates()
    }
  }

  redo () {
    super.redo()
    this.editorState.propagateUpdates()
  }

  _onDocumentChange (change, info) {
    const editorState = this.editorState
    // ATTENTION: ATM we are using a DocumentChange to implement node states
    // Now it happens, that something that reacts on document changes (particularly a CitationManager)
    // updates the node state during a flow.
    // HACK: In that case we 'merge' the state update into the already propagated document change
    if (editorState.isDirty('document') && info.action === 'node-state-update') {
      let propagatedChange = editorState.getUpdate('document').change
      Object.assign(propagatedChange.updated, change.updated)
    } else {
      this.editorState._setUpdate('document', { change, info })
      this.editorState.hasUnsavedChanges = true
    }
  }

  _resetOverlayId () {
    const overlayId = this.editorState.overlayId
    // overlayId === path.join('.') => if selection is value &&
    // Overlays of value components (ManyRelationshipComponent, SingleRelationship)
    // need to remain open if the selection is a value selection
    let sel = this.getSelection()
    if (sel && sel.customType === 'value') {
      let valueId = String(sel.data.path)
      if (overlayId !== valueId) {
        this.editorState.set('overlayId', valueId)
      }
    } else {
      this.editorState.set('overlayId', null)
    }
  }
}
