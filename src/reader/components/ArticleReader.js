import { ScrollPane, WorkflowPane, DefaultDOMElement } from 'substance'
import { AbstractWriter } from '../../editor/util'
import TOCProvider from '../../editor/util/TOCProvider'
import TOC from '../../editor/components/TOC'
import ReferenceManager from '../../editor/util/ReferenceManager'
import FigureManager from '../../editor/util/FigureManager'
import TableManager from '../../editor/util/TableManager'
import FootnoteManager from '../../editor/util/FootnoteManager'

export default class ArticleReader extends AbstractWriter {

  getChildContext() {
    return Object.assign({}, super.getChildContext(), {
      referenceManager: this.referenceManager,
      figureManager: this.figureManager,
      tableManager: this.tableManager,
      footnoteManager: this.footnoteManager
    })
  }

  render($$) {
    let el = $$('div').addClass('sc-texture-reader')
    el.append(
      this._renderMainSection($$),
      this._renderContextPane($$)
    )
    return el
  }

  getConfigurator() {
    return this.props.editorSession.configurator
  }

  didMount() {
    super.didMount()
    this.handleActions({
      'switchContext': this._switchContext
    })

    // HACK: we need to re-evaluate command states, now that the UI has mounted
    this.editorSession.commandManager._updateCommandStates(this.editorSession)

    DefaultDOMElement.getBrowserWindow().on('resize', this._showHideTOC, this)
    this.tocProvider.on('toc:updated', this._showHideTOC, this)
    this._showHideTOC()
    this._restoreViewport()
  }

  didUpdate() {
    super.didUpdate()
    this._showHideTOC()
    this._restoreViewport()
  }

  getViewport() {
    return {
      x: this.refs.contentPanel.getScrollPosition()
    }
  }

  _restoreViewport() {
    if (this.props.viewport) {
      this.refs.contentPanel.setScrollPosition(this.props.viewport.x)
    }

    // HACK: This should work without a timeout, however it seems that
    // Editor.didMount is called earlier than the didMounts of the different
    // surfaces which do the surface registering, required here.
    setTimeout(() => {
      // We also use this place to rerender the selection
      let editorSession = this.editorSession
      let focusedSurface = editorSession.getFocusedSurface()
      if (focusedSurface) {
        focusedSurface.rerenderDOMSelection()
      }
    })
  }

  _dispose() {
    let doc = this.editorSession.getDocument()
    super._dispose()
    DefaultDOMElement.getBrowserWindow().off(this)
    this.tocProvider.off(this)
    delete doc.referenceManager
  }

  _initialize(props) {
    super._initialize(props)
    let editorSession = props.editorSession
    let doc = editorSession.getDocument()

    this.referenceManager = new ReferenceManager({
      labelGenerator: editorSession.getConfigurator().getLabelGenerator('references'),
      editorSession,
      pubMetaDbSession: props.pubMetaDbSession
    })

    // HACK: we need to expose referenceManager somehow, so it can be used in
    // the JATSExporter. We may want to consider including referenceManager in
    // TextureDocument instead.
    doc.referenceManager = this.referenceManager

    this.figureManager = new FigureManager({
      labelGenerator: editorSession.getConfigurator().getLabelGenerator('figures'),
      editorSession
    })
    this.tableManager = new TableManager({
      labelGenerator: editorSession.getConfigurator().getLabelGenerator('tables'),
      editorSession
    })
    this.footnoteManager = new FootnoteManager({
      labelGenerator: editorSession.getConfigurator().getLabelGenerator('footnotes'),
      editorSession
    })
  }



  /*
    Switches the state of the context panel
  */
  _switchContext(state) {
    this.refs.contextSection.setState(state)
  }



  _renderTOCPane($$) {
    let el = $$('div').addClass('se-toc-pane').ref('tocPane')
    el.append(
      $$('div').addClass('se-context-pane-content').append(
        $$(TOC)
      )
    )
    return el
  }

  _renderContextPane($$) {
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

  _renderMainSection($$) {
    const configurator = this.getConfigurator()
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

  _renderContentPanel($$) {
    const doc = this.editorSession.getDocument()
    const configurator = this.getConfigurator()
    const ManuscriptComponent = this.getComponent('manuscript')
    const Overlay = this.getComponent('overlay')
    const ContextMenu = this.getComponent('context-menu')
    const Dropzones = this.componentRegistry.get('dropzones', 'strict')

    const article = doc.get('article')

    let contentPanel = $$(ScrollPane, {
      tocProvider: this.tocProvider,
      // scrollbarType: 'substance',
      contextMenu: 'custom',
      scrollbarPosition: 'right',
      highlights: this.contentHighlights,
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

  _scrollTo(nodeId) {
    this.refs.contentPanel.scrollTo(`[data-id="${nodeId}"]`)
  }

  tocEntrySelected(nodeId) {
    const node = this.doc.get(nodeId)
    const editorSession = this.getEditorSession()
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

  _showHideTOC() {
    let editorSectionWidth = this.refs.editorSection.el.width
    if (!this._isTOCVisible() || editorSectionWidth < 960) {
      this.el.addClass('sm-compact')
    } else {
      this.el.removeClass('sm-compact')
    }
  }

  _isTOCVisible() {
    let entries = this.tocProvider.getEntries()
    return entries.length >= 2
  }

  /*
    Exporter provided by Texture
  */
  _getExporter() {
    return this.context.exporter
  }

  _getTOCProvider() {
    let containerId = this._getBodyContentContainerId()
    let doc = this.editorSession.getDocument()
    return new TOCProvider(doc, {
      containerId: containerId
    })
  }

  _getBodyContentContainerId() {
    const doc = this.editorSession.getDocument()
    let bodyContent = doc.article.find('body-content')
    return bodyContent.id
  }

}
