import { ScrollPane, Layout, WorkflowPane } from 'substance'
import { AbstractWriter } from '../util'
import TOCProvider from '../util/TOCProvider'
import TOC from './TOC'
import ReferenceManager from '../util/ReferenceManager'
import FigureManager from '../util/FigureManager'
import TableManager from '../util/TableManager'
import FootnoteManager from '../util/FootnoteManager'

export default class Editor extends AbstractWriter {

  constructor(...args) {
    super(...args)
    let editorSession = this.props.editorSession

    this.referenceManager = new ReferenceManager({
      labelGenerator: editorSession.getConfigurator().getLabelGenerator('references'),
      editorSession,
      pubMetaDbSession: this.props.pubMetaDbSession
    })
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

  didMount() {
    super.didMount()
    this.handleActions({
      'switchContext': this._switchContext
    })
  }

  getChildContext() {
    return Object.assign({}, super.getChildContext(), {
      referenceManager: this.referenceManager,
      figureManager: this.figureManager,
      tableManager: this.tableManager,
      footnoteManager: this.footnoteManager
    })
  }

  /*
    Switches the state of the context panel
  */
  _switchContext(state) {
    this.refs.contextSection.setState(state)
  }

  render($$) {
    let el = $$('div').addClass('sc-editor')
    el.append(
      this._renderMainSection($$),
      this._renderContextPane($$)
    )
    return el
  }

  _renderContextPane($$) {
    let el = $$('div').addClass('se-context-pane')
    if (this.props.contextComponent) {
      el.append(
        $$('div').addClass('se-context-pane-content').append(
          this.props.contextComponent
        )
      )
    } else {
      el.append(
        $$('div').addClass('se-context-pane-content').append(
          $$(TOC)
        )
      )
    }
    return el
  }

  _renderMainSection($$) {
    const configurator = this.getConfigurator()
    let mainSection = $$('div').addClass('se-main-section')
    mainSection.append(
      this._renderToolbar($$),
      this._renderContentPanel($$),
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
    // const ContextMenu = this.getComponent('context-menu')
    // const Dropzones = this.componentRegistry.get('dropzones', 'strict')

    const article = doc.get('article')

    let contentPanel = $$(ScrollPane, {
      tocProvider: this.tocProvider,
      scrollbarType: 'substance',
      scrollbarPosition: 'left',
      highlights: this.contentHighlights,
    }).ref('contentPanel')

    let layout = $$(Layout, {
      width: 'large'
    })

    layout.append(
      $$(ManuscriptComponent, {
        node: article,
        disabled: this.props.disabled
      })
    )

    contentPanel.append(
      layout,
      $$(Overlay, {
        toolPanel: configurator.getToolPanel('main-overlay'),
        theme: 'dark'
      })
      // $$(ContextMenu),
      // $$(Dropzones)
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
      editorSession.setSelection({
        type: 'property',
        path: node.getPath(),
        startOffset: 0,
        surfaceId: surface.id,
        containerId: surface.getContainerId()
      })
      return this._scrollTo(nodeId)
    }
  }

  getConfigurator() {
    return this.props.editorSession.configurator
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
