import { Component } from 'substance'
import {
  Managed, AppState, createComponentContext, CommandManager
} from '../shared'
import ArticleAPI from './ArticleAPI'

const DEFAULT_VIEW = 'manuscript'

export default class ArticlePanel extends Component {
  constructor (...args) {
    super(...args)

    this._initialize(this.props, this.state)

    this.handleActions({
      executeCommand: this._executeCommand
    })
  }

  _initialize (props, state) {
    const archive = props.archive
    const articleSession = props.documentSession
    const config = props.config
    const modelRegistry = config.getConfiguration('model').getModelRegistry()
    this.commandManager = new CommandManager(state, ['view'], config.getCommands(), this)
    this.context = Object.assign(createComponentContext(config), {
      urlResolver: archive,
      appState: this.state
    })
    // initial reduce step
    this.commandManager.reduce()
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
      appState: this.state
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
      this._renderNavbar($$),
      this._renderContent($$)
    )
    return el
  }

  _renderNavbar ($$) {
    const config = this.props.config
    const Toolbar = this.getComponent('toolbar')
    let el = $$('div').addClass('se-nav-bar')
    el.append(
      $$(Managed(Toolbar), {
        toolPanel: config.getToolPanel('nav-bar'),
        bindings: [
          'commandStates'
        ]
      }).ref('navBar')
    )
    return el
  }

  _renderContent ($$) {
    const props = this.props
    const view = this.state.view
    const api = this.api
    const archive = props.archive
    const articleSession = props.documentSession
    const config = props.config.getConfiguration(view)

    let ContentComponent
    if (view === 'manuscript') {
      ContentComponent = this.getComponent('manuscript-editor')
    } else if (this.state.view === 'metadata') {
      ContentComponent = this.getComponent('metadata-editor')
    }
    return $$(ContentComponent, {
      api,
      archive,
      config,
      articleSession
    })
  }

  _executeCommand (name, params) {
    this.commandManager.executeCommand(name, params)
  }

  _createAppState (config) {
    const appState = new AppState({
      view: DEFAULT_VIEW,
      commandStates: {}
    })
    appState.addObserver(['view'], this.rerender, this, { stage: 'render' })
    return appState
  }
}
