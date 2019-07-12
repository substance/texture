import { AbstractEditorSession as SubstanceAbstractEditorSession, SimpleChangeHistory, Selection } from 'substance'
import EditorState from './EditorState'

/*
 *  Overidden to add EditorState related logic.
 */
export default class AbstractEditorSession extends SubstanceAbstractEditorSession {
  constructor (id, document, initialEditorState = {}) {
    super(id, document)

    let editorState = new EditorState(this._createEditorState(document, initialEditorState))
    this.editorState = editorState
  }

  initialize () {
    // EXPERIMENTAL: hook that records changes triggered via node state updates
    this.editorState.document.on('document:changed', this._onDocumentChange, this)
  }

  dispose () {
    let editorState = this.editorState
    editorState.document.off(this)
    editorState.off(this)
    editorState.dispose()
  }

  _createEditorState (document, initialState = {}) {
    return Object.assign({
      document,
      history: new SimpleChangeHistory(this),
      selection: Selection.nullSelection,
      selectionState: {},
      hasUnsavedChanges: false,
      isBlurred: false
    }, initialState)
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
    const editorState = this.editorState
    if (editorState.isBlurred) {
      editorState.isBlurred = false
    }
    editorState.propagateUpdates()
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
    // console.log('_AbstractEditorSession._onDocumentChange', change, info)
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
}
