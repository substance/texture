import { Component, Toolbar, isEqual } from 'substance'
import TextureArticleAPI from './TextureArticleAPI'

export default class ArticlePanel extends Component {
  constructor (...args) {
    super(...args)

    this._initialize(this.props)

    this.handleActions({
      'openView': this._openView
    })
  }

  _initialize (props) {
    const articleSession = props.articleSession
    const pubMetaDbSession = props.pubMetaDbSession
    const config = props.config
    const doc = articleSession.getDocument()
    const api = new TextureArticleAPI(
      articleSession,
      pubMetaDbSession,
      config.getModelRegistry()
    )
    // HACK: we need to expose referenceManager somehow, so it can be used in
    // the JATSExporter. We may want to consider including referenceManager in
    // TODO: Exporters should use the API instead
    doc.referenceManager = api.getReferenceManager()
    this.config = config
    this.api = api
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
    const api = this.api
    const config = this.config
    const articleSession = this.props.articleSession
    const pubMetaDbSession = this.props.pubMetaDbSession
    return {
      api,
      configurator: config,
      articleSession,
      pubMetaDbSession,
      urlResolver: archive,
      // TODO: these should go into 'ManuscriptEditor'
      referenceManager: api.getReferenceManager(),
      footnoteManager: api.getFootnoteManager(),
      figureManager: api.getFigureManager(),
      tableManager: api.getTableManager(),
      // legacy
      editorSession: articleSession,
      // TODO: make the context footprint smaller
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
    const config = this.config
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
    let ContentComponent
    if (this.state.view === 'manuscript') {
      ContentComponent = this.getComponent('manuscript-editor')
    } else if (this.state.view === 'meta-data') {
      ContentComponent = this.getComponent('meta-data-editor')
    }
    return $$(ContentComponent, {
      articleSession,
      pubMetaDbSession,
      // legacy
      editorSession: articleSession
    })
  }

  _openView (name) {
    switch (name) {
      case 'manuscript':
      case 'meta-data': {
        this.extendState({ view: name })
        break
      }
      default:
        console.error(`Unknown view: ${name}`)
    }
  }
}
