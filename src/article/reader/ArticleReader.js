import {
  Component, DefaultDOMElement
} from 'substance'
import { createEditorContext, Managed } from '../../kit'
import ArticleAPI from '../ArticleAPI'
import ArticleEditorSession from '../ArticleEditorSession'
import ManuscriptModel from '../shared/ManuscriptModel'
import TOCProvider from '../editor/TOCProvider'
import TOC from '../editor/TOC'

export default class ArticleReader extends Component {
  constructor (...args) {
    super(...args)

    this.handleActions({
      executeCommand: this._executeCommand,
      tocEntrySelected: this._tocEntrySelected,
      toggleOverlay: this._toggleOverlay
    })

    this._initialize(this.props)
  }

  _initialize (props) {
    const { articleSession, config, archive } = props
    const editorSession = new ArticleEditorSession(articleSession.getDocument(), config, this, {
      viewName: this.props.viewName
    })
    const api = new ArticleAPI(articleSession, config.getModelRegistry())
    this.api = api
    this.model = new ManuscriptModel(api)
    this.tocProvider = this._getTOCProvider()
    this.context = Object.assign(createEditorContext(config, editorSession), {
      api,
      tocProvider: this.tocProvider,
      urlResolver: archive
    })
    this.context.appState.addObserver(['viewName'], this._updateViewName, this, { stage: 'render' })

    this.editorSession = editorSession
    // initial reduce etc.
    this.editorSession.initialize()
  }

  _updateViewName () {
    let appState = this.context.appState
    this.send('updateViewName', appState.viewName)
  }

  didMount () {
    this.tocProvider.on('toc:updated', this._showHideTOC, this)
    this._showHideTOC()

    DefaultDOMElement.getBrowserWindow().on('resize', this._showHideTOC, this)
  }

  didUpdate () {
    this._showHideTOC()
  }

  dispose () {
    const appState = this.context.appState
    const articleSession = this.props.articleSession
    const editorSession = this.editorSession

    this.tocProvider.off(this)
    articleSession.off(this)
    editorSession.dispose()
    DefaultDOMElement.getBrowserWindow().off(this)
    appState.removeObserver(this)
    this.empty()
  }

  getComponentRegistry () {
    return this.props.config.getComponentRegistry()
  }

  render ($$) {
    let el = $$('div').addClass('sc-article-reader')
    el.append(
      this._renderMainSection($$),
      this._renderContextPane($$)
    )
    return el
  }

  _renderContextPane ($$) {
    // TODO: we need to revisit this
    // We have introduced this to be able to inject a shared context panel
    // in Stencila. However, ATM we try to keep the component
    // as modular as possible, and avoid these kind of things.
    if (this.props.contextComponent) {
      let el = $$('div').addClass('se-context-pane')
      el.append(
        $$('div').addClass('se-context-pane-content').append(
          this.props.contextComponent
        )
      )
      return el
    }
  }

  _renderMainSection ($$) {
    let mainSection = $$('div').addClass('se-main-section')
    mainSection.append(
      this._renderToolbar($$),
      $$('div').addClass('se-content-section').append(
        this._renderTOCPane($$),
        this._renderContentPanel($$)
      ).ref('contentSection')
    )
    return mainSection
  }

  _renderToolbar ($$) {
    const Toolbar = this.getComponent('toolbar')
    const configurator = this._getConfigurator()
    const toolPanel = configurator.getToolPanel('toolbar', true)
    return $$('div').addClass('se-toolbar-wrapper').append(
      $$(Managed(Toolbar), {
        toolPanel,
        bindings: ['commandStates']
      }).ref('toolbar')
    )
  }

  _renderTOCPane ($$) {
    let el = $$('div').addClass('se-toc-pane').ref('tocPane')
    el.append(
      $$('div').addClass('se-context-pane-content').append(
        $$(TOC)
      )
    )
    return el
  }

  _renderContentPanel ($$) {
    const ScrollPane = this.getComponent('scroll-pane')
    const ManuscriptComponent = this.getComponent('manuscript')

    let contentPanel = $$(ScrollPane, {
      tocProvider: this.tocProvider
    }).ref('contentPanel')

    contentPanel.append(
      $$(ManuscriptComponent, {
        model: this.model,
        disabled: this.props.disabled
      }).ref('article')
    )
    return contentPanel
  }

  getViewport () {
    return {
      x: this.refs.contentPanel.getScrollPosition()
    }
  }

  _getConfigurator () {
    return this.props.config
  }

  _getEditorSession () {
    return this.editorSession
  }

  _getDocument () {
    return this.props.articleSession.getDocument()
  }

  _tocEntrySelected (nodeId) {
    const nodeComponent = this.refs.contentPanel.find(`[data-id="${nodeId}"]`)
    if (nodeComponent) {
      return this._scrollTo(nodeId)
    }
  }

  _scrollTo (nodeId) {
    this.refs.contentPanel.scrollTo(`[data-id="${nodeId}"]`)
  }

  _showHideTOC () {
    let contentSectionWidth = this.refs.contentSection.el.width
    if (!this._isTOCVisible() || contentSectionWidth < 960) {
      this.el.addClass('sm-compact')
    } else {
      this.el.removeClass('sm-compact')
    }
  }

  _isTOCVisible () {
    let entries = this.tocProvider.getEntries()
    return entries.length >= 2
  }

  _getTOCProvider () {
    let containerId = this._getBodyContainerId()
    return new TOCProvider(this.props.articleSession, { containerId: containerId })
  }

  _getBodyContainerId () {
    return 'body'
  }

  _executeCommand (name, params) {
    this.editorSession.executeCommand(name, params)
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
}
