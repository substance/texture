import { Component } from 'substance'
import { AppState, EditorSession, createComponentContext } from '../kit'
import DefaultSettings from './settings/DefaultSettings'
import EditorSettings from './settings/ExperimentalEditorSettings'
import FigurePackageSettings from './settings/FigurePackageSettings'

const DEFAULT_VIEW = 'manuscript'
const VIEWS = ['manuscript', 'metadata']

export default class ArticlePanel extends Component {
  constructor (...args) {
    super(...args)

    // Store the viewports, so we can restore scroll positions
    this._viewStates = new Map()

    // TODO: should we really (ab-)use the regular Component state as AppState?
    this._initialize(this.props, this.state)

    this.handleActions({
      'updateViewName': this._updateViewName
    })
  }

  _initialize (props) {
    // TODO: I want to move to a single-layer setup for all views in this panel,
    // i.e. no extra configurations and if possible no extra editor session
    // and instead contextualize commands tools etc.
    const { archive, config, documentSession } = props
    const doc = documentSession.getDocument()

    this.context = Object.assign(this.context, createComponentContext(config), {
      urlResolver: archive,
      appState: this.state
    })

    // setup view states
    for (let viewName of VIEWS) {
      let viewConfig = props.config.getConfiguration(viewName)
      let editorState = EditorSession.createEditorState(documentSession, {
        workflowId: null,
        viewName,
        settings: this._createSettings(doc)
      })
      this._viewStates.set(viewName, {
        config: viewConfig,
        editorState,
        // Note: used to retain scroll position when switching between views
        viewport: null
      })
    }
  }

  getInitialState () {
    // using AppState as Component state
    return this._createAppState(this.props.config)
  }

  willReceiveProps (props) {
    if (props.documentSession !== this.props.documentSession) {
      let state = this._createAppState(props.config)
      this._initialize(props, state)
      // wipe children and update state
      this.empty()
      this.setState(state)
    }
  }

  getChildContext () {
    return {
      articlePanel: this,
      appState: this.state
    }
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
      newProps.documentSession !== this.props.documentSession ||
      newProps.config !== this.props.config ||
      newState !== this.state
    )
  }

  render ($$) {
    let el = $$('div').addClass('sc-article-panel')
    el.append(
      this._renderContent($$)
    )
    return el
  }

  _renderContent ($$) {
    const props = this.props
    const viewName = this.state.viewName
    const api = this.api
    const archive = props.archive
    const articleSession = props.documentSession
    const { config, editorState, viewport } = this._viewStates.get(viewName)

    let ContentComponent
    switch (viewName) {
      case 'manuscript': {
        ContentComponent = this.getComponent('manuscript-editor')
        break
      }
      case 'metadata': {
        ContentComponent = this.getComponent('metadata-editor')
        break
      }
      default:
        throw new Error('Unsupported view: ' + viewName)
    }
    return $$(ContentComponent, {
      api,
      archive,
      articleSession,
      config,
      editorState,
      viewName,
      viewport
    }).ref('content')
  }

  _createAppState (config) { // eslint-disable-line no-unused-vars
    const appState = new AppState({
      viewName: DEFAULT_VIEW
    })
    appState.addObserver(['viewName'], this.rerender, this, { stage: 'render' })
    return appState
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

  _updateViewName (viewName) {
    let oldViewName = this.state.viewName
    if (oldViewName !== viewName) {
      this._viewStates.get(oldViewName).viewport = this.refs.content.getViewport()
      this.extendState({ viewName })
    }
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

  _onRouteChange (data) {
    // EXPERIMENTAL: taking an object from the router
    // and interpreting it to navigate to the right location in the app
    let { viewName, nodeId, section } = data
    let el
    if (viewName && viewName !== this.state.viewName) {
      this.extendState({ viewName })
    }
    if (nodeId) {
      // NOTE: we need to search elements only inside editor
      // since TOC contains the same attributes
      el = this.el.find(`.se-content [data-id=${nodeId}]`)
    } else if (section) {
      // NOTE: since we are using dots inside id attributes,
      // we need to be careful with a dom query
      el = this.el.find(`[id='${section}']`)
    }
    if (el) {
      this.refs.content.send('scrollElementIntoView', el)
    }
  }
}
