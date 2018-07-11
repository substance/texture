import { Component, isEqual } from 'substance'
import Managed from '../shared/Managed'
import AppState from '../shared/AppState'

const DEFAULT_VIEW = 'metadata'

export default class ArticlePanel extends Component {
  constructor (...args) {
    super(...args)

    this.handleActions({
      executeCommand: this._executeCommand
    })

    this._initialize(this.props)
  }

  _initialize (props) {
    const config = props.config
    const archive = this.props.archive

    let context = Object.assign({}, super._getContext(), {
      commandGroups: config.getCommandGroups(),
      tools: {},
      componentRegistry: config.getComponentRegistry(),
      labelProvider: config.getLabelProvider(),
      keyboardShortcuts: config.getKeyboardShortcuts(),
      iconProvider: config.getIconProvider(),
      urlResolver: archive
    })

    let appState = new AppState({
      view: 'manuscript',
      commandStates: {}
    })
    context.state = appState
    CommandStatesReducer.connect(appState, config, ['view'], context)
    appState.addObserver(['view'], this._onViewChange, this, { stage: 'render' })

    let editorSession = new ArticlePanelSession(this, config, context)
    context.editorSession = editorSession

    this.context = context
    this._appState = appState
    this._editorSession = editorSession
  }

  getInitialState () {
    return {
      view: 'manuscript'
    }
  }

  willReceiveProps (newProps) {
    if (!isEqual(newProps, this.props)) {
      this._initialize(newProps)
    }
  }

  getChildContext () {
    const archive = this.props.archive
    const config = this._getViewConfig()
    return {
      state: this._appState,
      configurator: config,
      urlResolver: archive
    }
  }

  shouldRerender (newProps, newState) {
    // only rerender if something relevant has changed
    return (
      newProps.articleSession !== this.props.articleSession ||
      newProps.pubMetaDbSession !== this.props.pubMetaDbSession ||
      newProps.config !== this.props.config ||
      !isEqual(newState, this.state)
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
    const articleSession = this.props.articleSession
    const pubMetaDbSession = this.props.pubMetaDbSession
    const config = this._getViewConfig()
    const view = this.state.view
    let ContentComponent
    if (view === 'manuscript') {
      ContentComponent = this.getComponent('manuscript-editor')
    } else if (this.state.view === 'metadata') {
      ContentComponent = this.getComponent('metadata-editor')
    }
    return $$(ContentComponent, {
      articleSession,
      pubMetaDbSession,
      config,
      // legacy
      editorSession: articleSession
    })
  }

  _getViewConfig () {
    const view = this.state.view
    switch (view) {
      case 'manuscript':
      case 'metadata':
      case 'preview': {
        return this.props.config.getConfiguration(view)
      }
      default:
        throw new Error('Invalid state')
    }
  }

  _onViewChange () {
    const appState = this._appState
    this.extendState({
      view: appState.get('view')
    })
  }

  _executeCommand (name, params) {
    this._editorSession.executeCommand(name, params)
  }
}

// HACK: a lot of things, such as tools and panels, depend on EditorSession
// even if we do not have an Editor on this application level.
// This is a dumbed down EditorSession just to get things working.
// Instead we should generalize implementations so that we can use
// them in a non-editor scenario, too
class ArticlePanelSession {
  constructor (articlePanel, config, context) {
    this.articlePanel = articlePanel
    this.config = config
    this.commands = {}
    this.context = context

    config.getCommands().forEach(cmd => {
      this.commands[cmd.name] = cmd
    })
  }

  // isBlurred () {}
  // getFocusedSurface () {}
  // getSelection () {}
  // onRender () {}
  off () {}

  executeCommand (name, params) {
    let commands = this.commands
    let cmd = commands[name]
    cmd.execute(params, this.context)
  }
}

class CommandStatesReducer {
  constructor (appState, config, deps, context) {
    this.appState = appState
    this.commands = config.getCommands()
    this.context = context

    appState.addObserver(deps, this.reduce, this, { stage: 'update' })
  }

  static connect (...args) {
    let reducer = new CommandStatesReducer(...args)
    reducer.reduce()
    return reducer
  }

  // HACK: don't know yet how to use AppState API here
  reduce () {
    const commands = this.commands
    const appState = this.appState
    let commandStates = {}
    commands.forEach(command => {
      commandStates[command.name] = command.getCommandState({}, this.context)
    })
    appState.set('commandStates', commandStates)
  }
}
