import { Component, $$, platform } from 'substance'
import { AppState, createComponentContext } from '../kit'
import DefaultSettings from './settings/DefaultSettings'
import EditorSettings from './settings/ExperimentalEditorSettings'
import FigurePackageSettings from './settings/FigurePackageSettings'
import ArticleAPI from './api/ArticleAPI'
import ArticleEditorSession from './api/ArticleEditorSession'

export default class ArticlePanel extends Component {
  constructor (...args) {
    super(...args)

    this._initialize(this.props, this.state)
  }

  getActionHandlers () {
    return {
      executeCommand: this._executeCommand,
      toggleOverlay: this._toggleOverlay,
      // TODO: is this really the right place?
      // IMO this is editor specific and should go into BasicArticleEditor
      startWorkflow: this._startWorkflow,
      closeModal: this._closeModal,
      scrollElementIntoView: this._scrollElementIntoView,
      scrollTo: this._scrollTo,
      updateRoute: this._updateRoute
    }
  }

  _initialize (props) {
    // TODO: I want to move to a single-layer setup for all views in this panel,
    // i.e. no extra configurations and if possible no extra editor session
    // and instead contextualize commands tools etc.
    const { archive, config, document } = props
    const doc = document

    let editorSession = new ArticleEditorSession('article', doc, config, {
      workflowId: null,
      workflowProps: null,
      overlayId: null,
      settings: this._createSettings(doc)
    })
    this.editorSession = editorSession

    let appState = editorSession.editorState
    this.appState = appState

    let api = new ArticleAPI(editorSession, archive, config)
    this.api = api

    let context = Object.assign(this.context, createComponentContext(config), {
      config,
      editorSession,
      editorState: appState,
      api,
      archive,
      urlResolver: archive,
      editor: this
    })
    this.context = context

    editorSession.setContext(context)
    editorSession.initialize()

    appState.addObserver(['workflowId'], this.rerender, this, { stage: 'render' })
    appState.addObserver(['settings'], this._onSettingsUpdate, this, { stage: 'render' })
    // HACK: ATM there is no better way than to listen to an archive
    // event and forcing the CommandManager to update commandStates
    // and propagating the changes
    archive.on('archive:saved', () => {
      // HACK: setting the selection dirty, also makes sure the DOM selection gets rerendered
      // as opposed to triggering the commandManager directly
      appState._setDirty('selection')
      appState.propagateUpdates()
    })
    // HACK: resetting the app state here, because things might get 'dirty' during initialization
    // TODO: find out if there is a better way to do this
    appState._reset()
  }

  willReceiveProps (props) {
    if (props.document !== this.props.document) {
      this._initialize(props)
      this.empty()
    }
  }

  getContext () {
    return this.context
  }

  getContentPanel () {
    // This is part of the Editor interface
    // ATTENTION: being a legacy of the multi-view implementation
    // this has to provide the content panel of the content panel
    return this.refs.content.getContentPanel()
  }

  didMount () {
    let router = this.context.router
    if (router) {
      this._onRouteChange(router.readRoute())
      router.on('route:changed', this._onRouteChange, this)
    }
  }

  dispose () {
    let router = this.context.router
    if (router) {
      router.off(this)
    }
  }

  shouldRerender (newProps, newState) {
    return (
      newProps.document !== this.props.document ||
      newProps.config !== this.props.config ||
      newState !== this.state
    )
  }

  render () {
    let el = $$('div').addClass('sc-article-panel')
    el.append(
      this._renderContent()
    )
    return el
  }

  _renderContent () {
    const props = this.props
    const api = this.api
    const archive = props.archive
    const editorSession = this.editorSession
    const config = props.config

    let ContentComponent = this.getComponent('article-editor')
    return $$(ContentComponent, {
      api,
      archive,
      editorSession,
      config,
      editorState: editorSession.editorState
    }).ref('content')
  }

  _closeModal () {
    const appState = this._getAppState()
    let workflowId = appState.workflowId
    if (workflowId) {
      this._clearRoute()
    }
    appState.workflowId = null
    appState.overlayId = null
    appState.propagateUpdates()
  }

  _createAppState (config) { // eslint-disable-line no-unused-vars
    return new AppState()
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
    this._getEditorSession().executeCommand(name, params)
  }

  _getAppState () {
    return this.appState
  }

  _getEditorSession () {
    return this.editorSession
  }

  _handleKeydown (e) {
    // console.log('ArticlePanel._handleKeydown', e)
    // ATTENTION: asking the currently active content to handle the keydown event first
    let handled = this.refs.content._onKeydown(e)
    // Note: if we had a keyboardManager here we could ask it to handle the event
    // if (!handled) {
    //   handled = this.context.keyboardManager.onKeydown(e, this.context)
    // }
    if (handled) {
      e.stopPropagation()
      e.preventDefault()
    }
    return handled
  }

  _scrollElementIntoView (el, force) {
    return this.refs.content._scrollElementIntoView(el, force)
  }

  /**
   * Scroll to the node or other content.
   *
   * @param {string} params.nodeId
   */
  _scrollTo (params) {
    return this.refs.content._scrollTo(params)
  }

  _startWorkflow (workflowId, workflowProps) {
    const appState = this._getAppState()
    if (appState.workflowId) throw new Error('Another workflow has been started already.')
    appState.workflowId = workflowId
    appState.workflowProps = workflowProps
    appState.overlayId = workflowId
    appState.propagateUpdates()
    this._updateRoute({ workflow: workflowId })
  }

  _toggleOverlay (overlayId) {
    const appState = this._getAppState()
    if (appState.overlayId === overlayId) {
      appState.overlayId = null
    } else {
      appState.overlayId = overlayId
    }
    appState.propagateUpdates()
  }
  _onSettingsUpdate () {
    // FIXME: there is a BUG in Component.js leading to undisposed surfaces
    // HACK: instead of doing an incremental DOM update force disposal by wiping the content
    // ATTENTION: removing the following line leads to the BUG
    this.empty()
    this.rerender()
  }

  // Routing
  // =======
  // ATTENTION: routing is a questionable feature, because Texture might be embedded into an environment with
  // its own routing. We primarily use it for development. We are considering to remove it from this component
  // and instead do this just in the demo setup.
  // ATM, this is only activated when Texture is mounted with `enableRouting:true`

  _clearRoute () {
    let router = this.context.router
    // Note: we do not change the route while running tests, otherwise the test url get's lost
    // TODO: why is the TestSuite using a router? sounds like this could be achieved with URL params at least
    if (router && !platform.test) {
      router.clearRoute()
    }
  }

  _updateRoute (params) {
    let router = this.context.router
    // Note: we do not change the route while running tests, otherwise the test url get's lost
    // TODO: why is the TestSuite using a router? sounds like this could be achieved with URL params at least
    if (router && !platform.test) {
      router.writeRoute(params)
    }
  }

  _onRouteChange (data) {
    // EXPERIMENTAL: taking an object from the router
    // and interpreting it to navigate to the right location in the app
    let { workflow, section, nodeId } = data
    let el
    if (workflow && workflow !== this.appState.workflowId) {
      if (this.appState.workflowId) {
        this._closeModal()
      }
      this._startWorkflow(workflow)
    }
    if (nodeId) {
      // NOTE: we need to search elements only inside editor
      // since TOC contains the same attributes
      el = this.el.find(`.se-content [data-id='${nodeId}']`)
    } else if (section) {
      // NOTE: since we are using dots inside id attributes,
      // we need to be careful with a dom query
      el = this.el.find(`.se-content [data-section='${section}']`)
    }
    if (el) {
      // forcing scroll, i.e. bringing target element always to the top
      this.refs.content.send('scrollElementIntoView', el, true)
    }
  }
}
