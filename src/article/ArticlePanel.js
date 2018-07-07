import { Component, Toolbar, isEqual } from 'substance'

export default class ArticlePanel extends Component {
  constructor (...args) {
    super(...args)

    this._initialize(this.props)

    this.handleActions({
      'openView': this._openView
    })
  }

  _initialize (props) {
    const config = props.config
    this.context = Object.assign({}, super._getContext(), {
      componentRegistry: config.getComponentRegistry()
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
    const articleSession = this.props.articleSession
    const pubMetaDbSession = this.props.pubMetaDbSession
    return {
      configurator: config,
      articleSession,
      pubMetaDbSession,
      urlResolver: archive,
      // legacy
      editorSession: articleSession,
      // TODO: we need this because CommandManager, Toolgroups etc make use of this
      commandGroups: config.getCommandGroups(),
      tools: config.getTools(),
      labelProvider: config.getLabelProvider(),
      keyboardShortcuts: config.getKeyboardShortcuts(),
      iconProvider: config.getIconProvider(),
      commandManager: articleSession.commandManager
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
