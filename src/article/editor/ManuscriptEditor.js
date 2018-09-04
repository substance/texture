import {
  Component, DefaultDOMElement
} from 'substance'
import {
  Managed, createEditorContext
} from '../../kit'
import ArticleAPI from '../ArticleAPI'
import ArticleEditorSession from '../ArticleEditorSession'
import ManuscriptModel from '../models/ManuscriptModel'
import TOCProvider from './TOCProvider'
import TOC from './TOC'

export default class ManuscriptEditor extends Component {
  constructor (...args) {
    super(...args)

    this.handleActions({
      tocEntrySelected: this._tocEntrySelected,
      executeCommand: this._executeCommand,
      toggleOverlay: this._toggleOverlay,
      startWorkflow: this._startWorkflow,
      closeModal: this._closeModal
    })

    this._initialize(this.props)
  }

  _initialize (props) {
    const { articleSession, config, archive } = props
    const editorSession = new ArticleEditorSession(articleSession.getDocument(), config, this, {
      workflowId: null,
      viewName: this.props.viewName
    })
    const api = new ArticleAPI(editorSession, config.getModelRegistry(), archive)
    this.editorSession = editorSession
    this.api = api
    this.model = new ManuscriptModel(api)
    this.exporter = this._getExporter()
    this.tocProvider = this._getTOCProvider()
    this.context = Object.assign(createEditorContext(config, editorSession), {
      api,
      tocProvider: this.tocProvider,
      urlResolver: archive,
      editable: true
    })
    this.context.appState.addObserver(['workflowId'], this.rerender, this, { stage: 'render' })
    this.context.appState.addObserver(['viewName'], this._updateViewName, this, { stage: 'render' })

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
    this._restoreViewport()

    DefaultDOMElement.getBrowserWindow().on('resize', this._showHideTOC, this)
  }

  didUpdate () {
    this._showHideTOC()
    this._restoreViewport()
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
    let el = $$('div').addClass('sc-manuscript-editor')
      // sharing styles with sc-article-reader
      .addClass('sc-manuscript-view')
    el.append(
      this._renderMainSection($$),
      this._renderContextPane($$)
    )
    return el
  }

  _renderMainSection ($$) {
    const appState = this.context.appState
    let mainSection = $$('div').addClass('se-main-section')
    mainSection.append(
      this._renderToolbar($$),
      $$('div').addClass('se-content-section').append(
        this._renderTOCPane($$),
        this._renderContentPanel($$),
        this._renderFooterPane($$)
      ).ref('contentSection')
    )

    if (appState.workflowId) {
      let Modal = this.getComponent('modal')
      let WorkflowComponent = this.getComponent(appState.workflowId)
      let workflowModal = $$(Modal).addClass('se-workflow-modal sm-workflow-' + appState.workflowId).append(
        $$(WorkflowComponent, appState.workflowProps).ref('workflow')
      )
      mainSection.append(workflowModal)
    }

    return mainSection
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

  _renderContentPanel ($$) {
    const configurator = this._getConfigurator()
    const ScrollPane = this.getComponent('scroll-pane')
    const ManuscriptComponent = this.getComponent('manuscript')
    const Overlay = this.getComponent('overlay')
    const ContextMenu = this.getComponent('context-menu')
    const Dropzones = this.getComponent('dropzones')

    let contentPanel = $$(ScrollPane, {
      tocProvider: this.tocProvider,
      // scrollbarType: 'substance',
      contextMenu: 'custom',
      scrollbarPosition: 'right'
    }).ref('contentPanel')

    contentPanel.append(
      $$(ManuscriptComponent, {
        model: this.model,
        disabled: this.props.disabled
      }).ref('article'),
      $$(Managed(Overlay), {
        toolPanel: configurator.getToolPanel('main-overlay'),
        theme: 'light',
        bindings: ['commandStates']
      }),
      $$(Managed(ContextMenu), {
        toolPanel: configurator.getToolPanel('context-menu'),
        theme: 'light',
        bindings: ['commandStates']
      }),
      $$(Dropzones)
    )
    return contentPanel
  }

  _renderFooterPane ($$) {
    const FindAndReplaceDialog = this.getComponent('find-and-replace-dialog')
    let el = $$('div').addClass('se-footer-pane')
    let fnr = $$(FindAndReplaceDialog).ref('findAndReplace')
    el.append(fnr)
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

  _executeCommand (name, params) {
    this.editorSession.executeCommand(name, params)
  }

  _restoreViewport () {
    const editorSession = this._getEditorSession()
    if (this.props.viewport) {
      this.refs.contentPanel.setScrollPosition(this.props.viewport.x)
    }
    // HACK: This should work without a timeout, however it seems that
    // Editor.didMount is called earlier than the didMounts of the different
    // surfaces which do the surface registering, required here.
    setTimeout(() => {
      // We also use this place to rerender the selection
      let focusedSurface = editorSession.getFocusedSurface()
      if (focusedSurface) {
        focusedSurface.rerenderDOMSelection()
      }
    })
  }

  _tocEntrySelected (nodeId) {
    const node = this._getDocument().get(nodeId)
    const editorSession = this._getEditorSession()
    const nodeComponent = this.refs.contentPanel.find(`[data-id="${nodeId}"]`)
    if (nodeComponent) {
      // TODO: it needs to be easier to retrieve the surface
      let surface = nodeComponent.context.surface
      // There are cases when we can't set selection, e.g. for references
      if (surface) {
        editorSession.setSelection({
          type: 'property',
          path: node.getPath(),
          startOffset: 0,
          surfaceId: surface.id,
          containerId: surface.getContainerId()
        })
      }
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

  _getExporter () {
    return this.context.exporter
  }

  _getTOCProvider () {
    let containerId = this._getBodyContainerId()
    return new TOCProvider(this.props.articleSession, { containerId: containerId })
  }

  _getBodyContainerId () {
    return 'body'
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

  _startWorkflow (workflowId, props) {
    const appState = this.context.appState
    appState.workflowId = workflowId
    appState.overlayId = workflowId
    appState.workflowProps = props
    appState.propagateUpdates()
  }

  _closeModal () {
    const appState = this.context.appState
    appState.workflowId = null
    appState.overlayId = null
    appState.workflowProps = null
    appState.propagateUpdates()
  }
}
