import { Component, uuid, domHelpers } from 'substance'
import { ModalEditorSession, createEditorContext } from '../../kit'

/**
 * Experimental: A base class for Workflows that are manipulating an EditorSession.
 *
 * Instead of directly manipulating the parent editor session,
 * a stage session is created, working on a clone of the document.
 * At the end, all changes are merged into one big change, which is then
 * applied to the parent editor session.
 *
 * It is not yet clear, how much this can be generalized. Thus is not part of the app kit yet.
 */
export default class EditorWorkflow extends Component {
  constructor (...args) {
    super(...args)

    this._initialize(this.props)
  }

  _initialize (props) {
    let parentEditorSession = this._getParentEditorSession()

    let config = this._getConfig()
    this.config = config

    let editorSession = new ModalEditorSession(this._getWorkflowId(), parentEditorSession, config, this, this._getInitialEditorState())
    this.editorSession = editorSession

    this.appState = editorSession.editorState

    let api = this._createAPI()
    this.api = api

    let editor = this
    const context = Object.assign(createEditorContext(config, editorSession, editor), {
      api,
      editable: true
    })
    this.context = context

    editorSession.setContext(context)
    editorSession.initialize()
  }

  _getConfig () {
    throw new Error('This method is abstract')
  }

  _getInitialEditorState () {
    // TODO: this might not be generic
    let parentEditorState = this._getParentEditorState()
    return {
      overlayId: null,
      settings: parentEditorState.settings
    }
  }

  _getWorkflowId () {
    return uuid()
  }

  _getParentEditorState () {
    return this._getParentEditorSession().editorState
  }

  _getParentEditorSession () {
    return this._getParentContext().editorSession
  }

  _getParentContext () {
    return this.getParent().context
  }

  _createAPI () {
    throw new Error('This method is method is abstract.')
  }

  getActionHandlers () {
    return {
      executeCommand: this._executeCommand,
      toggleOverlay: this._toggleOverlay,
      scrollTo: this._scrollTo,
      scrollElementIntoView: this._scrollElementIntoView
    }
  }

  dispose () {
    this.editorSession.dispose()
  }

  render ($$) {
    let el = $$('div').addClass(this._getClassNames())
    // ATTENTION: don't let mousedowns and clicks pass, otherwise the parent will null the selection
    el.on('mousedown', this._onMousedown)
      .on('click', this._onClick)
    el.append(
      this._renderContent($$)
    )
    el.append(this._renderKeyTrap($$))
    return el
  }

  _renderKeyTrap ($$) {
    return $$('textarea').addClass('se-keytrap').ref('keytrap')
      .css({ position: 'absolute', width: 0, height: 0, opacity: 0 })
      .on('keydown', this._onKeydown)
      // TODO: copy'n'paste support?
      // .on('copy', this._onCopy)
      // .on('paste', this._onPaste)
      // .on('cut', this._onCut)
  }

  _renderContent ($$) {}

  _getClassNames () {
    return 'sc-editor-workflow'
  }

  beforeClose () {
    this.editorSession.commitChanges()
  }

  getComponentRegistry () {
    return this.config.getComponentRegistry()
  }

  getContentPanel () {
    return this.refs.contentPanel
  }

  _executeCommand (name, params) {
    this.editorSession.executeCommand(name, params)
  }

  _scrollElementIntoView (el, force) {
    this.refs.editor._scrollElementIntoView(el, force)
  }

  _scrollTo (params) {
    this.refs.editor._scrollTo(params)
  }

  _toggleOverlay (overlayId) {
    const appState = this.appState
    if (appState.overlayId === overlayId) {
      appState.overlayId = null
    } else {
      appState.overlayId = overlayId
    }
    appState.propagateUpdates()
  }

  _onClick (e) {
    domHelpers.stopAndPrevent(e)
    let focusedSurface = this.editorSession.getFocusedSurface()
    if (focusedSurface) {
      focusedSurface._blur()
    }
    this.editorSession.setSelection(null)
  }

  _onKeydown (e) {
    let handled = this.context.keyboardManager.onKeydown(e, this.context)
    if (handled) {
      e.stopPropagation()
      e.preventDefault()
    }
    return handled
  }

  _onMousedown (e) {
    e.stopPropagation()
  }
}
