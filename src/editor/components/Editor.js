import { ScrollPane, SplitPane, Layout, WorkflowPane } from 'substance'
import { AbstractWriter } from '../util'
import TOC from './TOC'
import TOCProvider from '../util/TOCProvider'
import MetadataComponent from './MetadataComponent'

export default class Editor extends AbstractWriter {

  getInitialState() {
    return {
      contextId: 'metadata'
    }
  }

  didMount() {
    this.handleActions({
      'switchTab': this._switchTab
    })
  }

  _switchTab(contextId) {
    this.setState({
      contextId: contextId
    })
  }

  render($$) {
    let el = $$('div').addClass('sc-editor')
    el.append(
      $$(SplitPane, {splitType: 'vertical', sizeB: '400px'}).append(
        this._renderMainSection($$),
        this._renderContextSection($$)
      )
    )
    return el
  }

  _renderContextSection($$) {
    const TabbedPane = this.getComponent('tabbed-pane')
    const configurator = this.getConfigurator()

    let contextComponent
    if (this.state.contextId === 'toc') {
      contextComponent = $$(TOC)
    } else if (this.state.contextId === 'metadata') {
      contextComponent = $$(MetadataComponent, {
        metadataSpec: configurator.getMetadataSpec()
      })
    }
    return $$('div').addClass('se-context-section').append(
      $$(TabbedPane, {
        tabs: [
          { id: 'toc', name: 'Contents' },
          { id: 'metadata', name: 'Metadata' }
        ],
        activeTab: this.state.contextId
      }).ref('tabbedPane').append(
        contextComponent
      )
    )
  }

  _renderMainSection($$) {
    const configurator = this.getConfigurator()
    let mainSection = $$('div').addClass('se-main-section')
    let splitPane = $$(SplitPane, {splitType: 'horizontal'}).append(
      this._renderToolbar($$),
      $$(SplitPane, {splitType: 'horizontal', sizeB: 'inherit'}).append(
        this._renderContentPanel($$),
        $$(WorkflowPane, {
          toolPanel: configurator.getToolPanel('workflow')
        })
      )
    )
    mainSection.append(splitPane)
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

  getConfigurator() {
    return this.props.editorSession.configurator
  }

  _getExporter() {
    // return this.getConfigurator().createExporter('texture-jats')
    return null
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
