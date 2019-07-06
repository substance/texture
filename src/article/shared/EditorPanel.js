import { Component, keys, platform } from 'substance'
import { createEditorContext } from '../../kit'

// Base-class for Manuscript- and MetadataEditor to reduced code-redundancy
export default class EditorPanel extends Component {
  constructor (...args) {
    super(...args)

    this._initialize(this.props)
  }

  getActionHandlers () {
    return {
      executeCommand: this._executeCommand,
      toggleOverlay: this._toggleOverlay,
      startWorkflow: this._startWorkflow,
      closeModal: this._closeModal,
      scrollElementIntoView: this._scrollElementIntoView,
      scrollTo: this._scrollTo
    }
  }

  // EXPERIMENTAL: Editor interface to be able to access the root element of editable content
  getContentPanel () {
    return this.refs.contentPanel
  }

  // TODO: shouldn't we react on willReceiveProps?
  _initialize (props) {
    const { api, editorSession, archive } = props
    const config = this.context.config

    // ATTENTION: augmenting the default context with editor stuff and api etc.
    // TODO: try to find a more idiomatic approach, without needing to hack the context
    // This should be solvable by sharing things like 'api' on the ArticlePanel level
    // and adding other things to getChildContext()
    const context = Object.assign(this.context, createEditorContext(config, editorSession, this), {
      api,
      archive,
      editor: this,
      urlResolver: archive,
      editable: true
    })

    this.api = api
    this.appState = context.appState
    this.context = context
    this.editorSession = editorSession

    this.editorSession.initialize()
    this.appState.addObserver(['workflowId'], this.rerender, this, { stage: 'render' })
    this.appState.addObserver(['settings'], this._onSettingsUpdate, this, { stage: 'render' })

    // HACK: ATM there is no better way than to listen to an archive
    // event and forcing the CommandManager to update commandStates
    // and propagating the changes
    archive.on('archive:saved', () => {
      // HACK: alternatively we could trigger the commandManager directly
      // but setting the selection dirty, also makes sure the DOM selection gets rerendered
      // this.editorSession.commandManager.reduce()
      this.appState._setDirty('selection')
      this.appState.propagateUpdates()
    })

    // HACK: resetting the app state here, because things might get 'dirty' during initialization
    // TODO: find out if there is a better way to do this
    this.appState._reset()
  }

  _restoreViewport () {
    if (this.props.viewport) {
      // console.log('Restoring viewport', this.props.viewport)
      this.refs.contentPanel.setScrollPosition(this.props.viewport.x)
    }
  }

  dispose () {
    const appState = this.context.appState
    const editorSession = this.editorSession
    editorSession.dispose()
    appState.removeObserver(this)
    this.props.archive.off(this)
  }

  getComponentRegistry () {
    return this.props.config.getComponentRegistry()
  }

  _closeModal () {
    const appState = this.context.appState
    appState.workflowId = null
    appState.overlayId = null
    appState.propagateUpdates()
  }

  _executeCommand (name, params) {
    this.editorSession.executeCommand(name, params)
  }

  _getConfigurator () {
    return this.props.config
  }

  _getContentPanel () {
    /* istanbul ignore next */
    throw new Error('This method is abstract')
  }

  _getDocument () {
    return this.props.editorSession.getDocument()
  }

  _getTheme () {
    // TODO: this should come from app settings
    return 'light'
  }

  _onKeydown (e) {
    // console.log('EditorPanel._onKeydown', e)
    let handled = false
    const appState = this.context.appState
    switch (e.keyCode) {
      case keys.ESCAPE: {
        if (appState.findAndReplace.enabled) {
          this.context.findAndReplaceManager.closeDialog()
          handled = true
        }
        break
      }
      default:
        //
    }
    if (!handled) {
      handled = this.context.keyboardManager.onKeydown(e, this.context)
    }
    if (handled) {
      e.stopPropagation()
      e.preventDefault()
    }
    return handled
  }

  _onSettingsUpdate () {
    // FIXME: there is a BUG in Component.js leading to undisposed surfaces
    // HACK: instead of doing an incremental DOM update force disposal by wiping the content
    // ATTENTION: removing the following line leads to the BUG
    this.empty()
    this.rerender()
  }

  _startWorkflow (workflowId) {
    const appState = this.context.appState
    appState.workflowId = workflowId
    appState.overlayId = workflowId
    appState.propagateUpdates()
  }

  _renderWorkflow ($$, workflowId) {
    let Modal = this.getComponent('modal')
    let WorkflowComponent = this.getComponent(workflowId)
    return $$(Modal, {
      width: WorkflowComponent.desiredWidth
    }).addClass('se-workflow-modal sm-workflow-' + workflowId).append(
      $$(WorkflowComponent).ref('workflow')
    )
  }

  _toggleOverlay (overlayId) {
    const appState = this.context.appState
    if (appState.overlayId === overlayId) {
      appState.overlayId = null
    } else {
      appState.overlayId = overlayId
    }
    appState.propagateUpdates()
  }

  _scrollElementIntoView (el, force) {
    this._getContentPanel().scrollElementIntoView(el, !force)
  }

  // used for scrolling when clicking on TOC entries
  _scrollTo (params) {
    let selector
    if (params.nodeId) {
      selector = `[data-id="${params.nodeId}"]`
    } else if (params.section) {
      selector = `[data-section="${params.section}"]`
    } else {
      throw new Error('Illegal argument')
    }
    let comp = this.refs.contentPanel.find(selector)
    if (comp) {
      this._scrollElementIntoView(comp.el, true)
    }
    let router = this.context.router
    // ATTENTION: do not change the route when running tests otherwise the test url get's lost
    if (router && !platform.test) {
      router.writeRoute(Object.assign({ viewName: this.props.viewName }, params))
    }
  }
}
