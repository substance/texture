import { Component, Toolbar, isEqual } from 'substance'

export default class ArticlePanel extends Component {
  constructor (...args) {
    super(...args)

    this.handleActions({
      'openView': this._openView
    })

    // TODO: rethink
    this._articlePanelSession = new ArticlePanelSession(this, this.props.config)

    this._initialize(this.props)
  }

  _initialize (props) {
    const config = props.config

    // WIP
    this._articlePanelSession._updateCommandStates()

    this.context = Object.assign({}, super._getContext(), {
      // HACK
      editorSession: this._articlePanelSession,
      commandGroups: config.getCommandGroups(),
      tools: {},
      componentRegistry: config.getComponentRegistry(),
      labelProvider: config.getLabelProvider(),
      keyboardShortcuts: config.getKeyboardShortcuts(),
      iconProvider: config.getIconProvider(),
      commandManager: this._articlePanelSession
    })
  }

  willReceiveProps (newProps) {
    if (!isEqual(newProps, this.props)) {
      this._initialize(newProps)
    }
  }

  getInitialState () {
    return {
      view: 'manuscript'
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
    } else if (this.state.view === 'meta-data') {
      ContentComponent = this.getComponent('meta-data-editor')
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
      case 'meta-data':
      case 'preview': {
        return this.props.config.getConfiguration(view)
      }
      default:
        throw new Error('Invalid state')
    }
  }

  _openView (name) {
    switch (name) {
      case 'manuscript':
      case 'meta-data':
      case 'preview': {
        this.extendState({ view: name })
        break
      }
      default:
        console.error(`Unknown view: ${name}`)
    }
  }
}

// HACK/WIP: ToolPanel is asking for editorSession
class ArticlePanelSession {
  constructor (articlePanel, config) {
    this.articlePanel = articlePanel
    this.config = config
    this.commands = {}
    this.commandStates = []

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
      commandStates[command.name] = command.getCommandState(params)
    })
    this.commandStates = commandStates
  }

  // HACK
  canUndo () {}
  canRedo () {}
  isBlurred () {}
  getFocusedSurface () {}
  getSelection () {}
  onRender () {}
  off () {}
  executeCommand (name, params, context) {
    let commands = this.commands
    let cmd = commands[name]
    cmd.execute(params, context)
  }
}
