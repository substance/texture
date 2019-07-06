import { Component } from 'substance'
import { AppState, EditorSession, createComponentContext } from '../kit'
import DefaultSettings from './settings/DefaultSettings'
import EditorSettings from './settings/ExperimentalEditorSettings'
import FigurePackageSettings from './settings/FigurePackageSettings'
import ArticleAPI from './ArticleAPI'

export default class ArticlePanel extends Component {
  constructor (...args) {
    super(...args)

    // TODO: should we really (ab-)use the regular Component state as AppState?
    this._initialize(this.props, this.state)
  }

  _initialize (props) {
    // TODO: I want to move to a single-layer setup for all views in this panel,
    // i.e. no extra configurations and if possible no extra editor session
    // and instead contextualize commands tools etc.
    const { archive, config, document } = props
    const doc = document

    this.editorSession = new EditorSession('article', doc, config, this, {
      workflowId: null,
      settings: this._createSettings(doc)
    })
    this.api = new ArticleAPI(this.editorSession, archive, config, this)
    this.context = Object.assign(this.context, createComponentContext(config), {
      urlResolver: archive,
      appState: this.state,
      config,
      editorSession: this.editorSession,
      api: this.api
    })
  }

  getInitialState () {
    // using AppState as Component state
    return this._createAppState(this.props.config)
  }

  willReceiveProps (props) {
    if (props.document !== this.props.document) {
      let state = this._createAppState(props.config)
      this._initialize(props, state)
      // wipe children and update state
      this.empty()
      this.setState(state)
    }
  }

  getContext () {
    return this.context
  }

  getChildContext () {
    return {
      articlePanel: this,
      appState: this.state,
      api: this.api
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
      newProps.document !== this.props.document ||
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
    const api = this.api
    const archive = props.archive
    const editorSession = this.editorSession
    const config = props.config

    // TODO: allow to
    let ContentComponent = this.getComponent('article-editor')
    return $$(ContentComponent, {
      api,
      archive,
      editorSession,
      config,
      editorState: editorSession.editorState
    }).ref('content')
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
