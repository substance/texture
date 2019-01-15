import { Component, keys } from 'substance'
import { createEditorContext } from '../../kit'
import ArticleEditorSession from '../ArticleEditorSession'
import ArticleAPI from '../ArticleAPI'
import DefaultSettings from '../settings/DefaultSettings'
import EditorSettings from '../settings/ExperimentalEditorSettings'
import FigurePackageSettings from '../settings/FigurePackageSettings'

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
      scrollElementIntoView: this._scrollElementIntoView
    }
  }

  // TODO: shouldn't we react on willReceiveProps?
  _initialize (props) {
    const { articleSession, config, archive } = props

    // TODO: I want to refactor how EditorSessions are created
    // particularly I want to work on the multi-view/user sessions
    const editorSession = new ArticleEditorSession(
      articleSession, config, this,
      // initial editor state
      {
        workflowId: null,
        viewName: this.props.viewName,
        settings: this._createSettings(articleSession.getDocument())
      }
    )
    const api = new ArticleAPI(editorSession, archive, config, articleSession, { getContext: () => this.context })

    const context = Object.assign(createEditorContext(config, editorSession), {
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
    this.appState.addObserver(['viewName'], this._updateViewName, this, { stage: 'render' })
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
    const articleSession = this.props.articleSession
    const editorSession = this.editorSession
    articleSession.off(this)
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

  // EXPERIMENTAL:
  // this is a first prototype for settings used to control editability and required fields
  // On the long run we need to understand better what different means of configuration we want to offer
  _createSettings (doc) {
    let settings = new EditorSettings()
    let metadata = doc.get('metadata')
    // Default settings
    settings.load(DefaultSettings)
    // Article type specific settings
    if (metadata.articleType === 'figure-package') {
      settings.extend(FigurePackageSettings)
    }
    return settings
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
    return this.props.articleSession.getDocument()
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

  _updateViewName () {
    let appState = this.context.appState
    this.send('updateViewName', appState.viewName)
  }
}
