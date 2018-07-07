import { Component, DefaultDOMElement, ScrollPane, WorkflowPane,
  Highlights, Toolbar
} from 'substance'
import SaveHandler from '../util/SaveHandler'
import TOCProvider from '../util/TOCProvider'
import { getXrefTargets } from '../util/xrefHelpers'
import TOC from './TOC'
import TextureArticleAPI from '../../article/TextureArticleAPI'

export default class ManuscriptEditor extends Component {
  constructor (...args) {
    super(...args)

    this.handleActions({
      'tocEntrySelected': this._tocEntrySelected,
      'switchContext': this._switchContext
    })

    this._initialize(this.props)
  }

  _initialize (props) {
    const articleSession = props.articleSession
    const pubMetaDbSession = props.pubMetaDbSession
    const config = props.config
    const api = new TextureArticleAPI(config, articleSession, pubMetaDbSession, this.context)

    this.api = api
    this.exporter = this._getExporter()
    this.tocProvider = this._getTOCProvider()
    this.saveHandler = this._getSaveHandler()
    this.contentHighlights = new Highlights(articleSession.getDocument())

    articleSession.setSaveHandler(this.saveHandler)
  }

  didMount () {
    const articleSession = this.props.articleSession
    // HACK: we need to re-evaluate command states, now that the UI has mounted
    this._updateCommandStates()

    this.tocProvider.on('toc:updated', this._showHideTOC, this)
    this._showHideTOC()
    this._restoreViewport()

    articleSession.onUpdate(this._onSessionUpdate, this)
    DefaultDOMElement.getBrowserWindow().on('resize', this._showHideTOC, this)
  }

  didUpdate () {
    this._showHideTOC()
    this._restoreViewport()
  }

  dispose () {
    const articleSession = this.props.articleSession
    this.tocProvider.off(this)
    articleSession.off(this)
    articleSession.detachEditor(this)
    DefaultDOMElement.getBrowserWindow().off(this)

    // Note: we need to clear everything, as the childContext
    // changes which is immutable
    this.empty()
  }

  getChildContext () {
    const api = this.api
    const articleSession = this.props.articleSession
    const pubMetaDbSession = this.props.pubMetaDbSession
    const config = this.props.config
    const componentRegistry = config.getComponentRegistry()
    const commandManager = api.commandManager
    const dragManager = api.dragManager
    const referenceManager = api.getReferenceManager()
    const surfaceManager = articleSession.surfaceManager
    const commandGroups = config.getCommandGroups()
    const tools = config.getTools()
    const labelProvider = config.getLabelProvider()
    const keyboardShortcuts = config.getKeyboardShortcuts()
    const iconProvider = config.getIconProvider()
    return {
      api,
      configurator: config,
      componentRegistry,
      referenceManager,
      // legacy
      editorSession: articleSession,
      pubMetaDbSession,
      // TODO: make the context footprint smaller
      commandManager,
      commandGroups,
      dragManager,
      iconProvider,
      keyboardShortcuts,
      labelProvider,
      surfaceManager,
      tocProvider: this.tocProvider,
      tools
    }
  }

  getComponentRegistry () {
    return this.props.config.getComponentRegistry()
  }

  render ($$) {
    let el = $$('div').addClass('sc-editor')
    el.append(
      this._renderMainSection($$),
      this._renderContextPane($$)
    )
    return el
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
    const configurator = this._getConfigurator()
    let mainSection = $$('div').addClass('se-main-section')
    mainSection.append(
      this._renderToolbar($$),
      $$('div').addClass('se-editor-section').append(
        this._renderTOCPane($$),
        this._renderContentPanel($$)
      ).ref('editorSection'),
      $$(WorkflowPane, {
        toolPanel: configurator.getToolPanel('workflow')
      })
    )
    return mainSection
  }

  _renderContentPanel ($$) {
    const doc = this._getDocument()
    const configurator = this._getConfigurator()
    const article = doc.get('article')

    const ManuscriptComponent = this.getComponent('manuscript')
    const Overlay = this.getComponent('overlay')
    const ContextMenu = this.getComponent('context-menu')
    const Dropzones = this.getComponent('dropzones')

    let contentPanel = $$(ScrollPane, {
      tocProvider: this.tocProvider,
      // scrollbarType: 'substance',
      contextMenu: 'custom',
      scrollbarPosition: 'right',
      highlights: this.contentHighlights
    }).ref('contentPanel')

    contentPanel.append(
      $$(ManuscriptComponent, {
        node: article,
        disabled: this.props.disabled
      }).ref('article'),
      $$(Overlay, {
        toolPanel: configurator.getToolPanel('main-overlay'),
        theme: 'light'
      }),
      $$(ContextMenu, {
        toolPanel: configurator.getToolPanel('context-menu'),
        theme: 'light'
      }),
      $$(Dropzones)
    )
    return contentPanel
  }

  _renderToolbar ($$) {
    let configurator = this._getConfigurator()
    return $$('div').addClass('se-toolbar-wrapper').append(
      $$(Toolbar, {
        toolPanel: configurator.getToolPanel('toolbar')
      }).ref('toolbar')
    )
  }

  getViewport () {
    return {
      x: this.refs.contentPanel.getScrollPosition()
    }
  }

  _getConfigurator () {
    return this.props.config
  }

  _getArticleSession () {
    return this.props.articleSession
  }

  _getDocument () {
    return this._getArticleSession().getDocument()
  }

  _getSaveHandler () {
    return new SaveHandler({
      documentId: this.props.documentId,
      xmlStore: this.context.xmlStore,
      exporter: this.exporter
    })
  }

  _updateCommandStates () {
    const articleSession = this._getArticleSession()
    articleSession.commandManager._updateCommandStates(articleSession)
  }

  _restoreViewport () {
    const articleSession = this._getArticleSession()
    if (this.props.viewport) {
      this.refs.contentPanel.setScrollPosition(this.props.viewport.x)
    }
    // HACK: This should work without a timeout, however it seems that
    // Editor.didMount is called earlier than the didMounts of the different
    // surfaces which do the surface registering, required here.
    setTimeout(() => {
      // We also use this place to rerender the selection
      let focusedSurface = articleSession.getFocusedSurface()
      if (focusedSurface) {
        focusedSurface.rerenderDOMSelection()
      }
    })
  }

  _switchContext (state) {
    this.refs.contextSection.setState(state)
  }

  _tocEntrySelected (nodeId) {
    const node = this._getDocument().get(nodeId)
    const editorSession = this._getArticleSession()
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
    let editorSectionWidth = this.refs.editorSection.el.width
    if (!this._isTOCVisible() || editorSectionWidth < 960) {
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
    let doc = this._getDocument()
    return new TOCProvider(doc, {
      containerId: containerId
    })
  }

  _getBodyContainerId () {
    const doc = this._getDocument()
    let body = doc.find('body')
    return body.id
  }

  _onSessionUpdate (editorSession) {
    if (!editorSession.hasChanged('document') && !editorSession.hasChanged('selection')) return

    let sel = editorSession.getSelection()
    let selectionState = editorSession.getSelectionState()
    let xrefs = selectionState.getAnnotationsForType('xref')
    let highlights = {
      'fig': [],
      'bibr': []
    }
    if (xrefs.length === 1 && xrefs[0].getSelection().equals(sel)) {
      let xref = xrefs[0]
      let targets = getXrefTargets(xref)
      highlights[xref.referenceType] = targets.concat([xref.id])
    }
    this.contentHighlights.set(highlights)
  }
}
