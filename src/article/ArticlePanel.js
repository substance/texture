import { Component, Toolbar, isEqual } from 'substance'
import AppState from '../shared/AppState'

const DEFAULT_VIEW = 'metadata'

export default class ArticlePanel extends Component {
  constructor (...args) {
    super(...args)
    // TODO: ATM many things such as ToolPanels depend on an editorSession
    // To be able to move away from that, we need to use customized components
    // here, i.e. not those from Substance
    this._articlePanelSession = new ArticlePanelSession(this, this.props.config)

    this._initialize(this.props)
  }

  getInitialState () {
    let state = AppState.create({ view: DEFAULT_VIEW })
    state.observe(['view'], this.rerender, this)
    return state
  }

  _initialize (props) {
    const config = props.config
    const archive = this.props.archive

    // WIP
    this._articlePanelSession._updateCommandStates()

    this.context = Object.assign({}, super._getContext(), {
      state: this.state,
      // HACK
      editorSession: this._articlePanelSession,
      commandGroups: config.getCommandGroups(),
      tools: {},
      componentRegistry: config.getComponentRegistry(),
      labelProvider: config.getLabelProvider(),
      keyboardShortcuts: config.getKeyboardShortcuts(),
      iconProvider: config.getIconProvider(),
      commandManager: this._articlePanelSession,
      urlResolver: archive
    })
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
    let el = $$('div').addClass('se-nav-bar')
    el.append(
      $$(Toolbar, {
        toolPanel: config.getToolPanel('nav-bar')
      }).ref('navBar')
    )
    return el
  }

  _renderContent ($$) {
    const articleSession = this.props.articleSession
    const pubMetaDbSession = this.props.pubMetaDbSession
    const config = this._getViewConfig()
    let ContentComponent
    if (this.state.view === 'manuscript') {
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
}

// HACK: a lot of things, such as tools and panels, depend on EditorSession
// even if we do not have an Editor on this application level.
// This is a dumbed down EditorSession just to get things working.
// Instead we should generalize implementations so that we can use
// them in a non-editor scenario, too
class ArticlePanelSession {
  constructor (articlePanel, config) {
    this.articlePanel = articlePanel
    this.config = config
    this.commands = {}
    this.commandStates = []

    this._context = { state: this.articlePanel.state }

    config.getCommands().forEach(cmd => {
      this.commands[cmd.name] = cmd
    })
  }

  getCommandStates () {
    return this.commandStates
  }

  // HACK: don't know yet how to use AppState API here
  _updateCommandStates () {
    let config = this.config
    let commands = config.getCommands()
    let params = {
      editorSession: this
    }
    let commandStates = {}
    commands.forEach(command => {
      commandStates[command.name] = command.getCommandState(params, this._context)
    })
    this.commandStates = commandStates
  }

  isBlurred () {}
  getFocusedSurface () {}
  getSelection () {}
  onRender () {}
  off () {}
  executeCommand (name, params) {
    let commands = this.commands
    let cmd = commands[name]
    cmd.execute(params, this._context)
  }
}
