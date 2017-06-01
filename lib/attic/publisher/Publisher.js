import { TOC } from 'substance'
import AbstractWriter from '../common/AbstractWriter'
import PublisherTOCProvider from './PublisherTOCProvider'

class Publisher extends AbstractWriter {
  render($$) {
    let SplitPane = this.componentRegistry.get('split-pane')
    let el = $$('div').addClass('sc-publisher')
    el.append(
      $$(SplitPane, {splitType: 'vertical', sizeB: '400px'}).append(
        this._renderMainSection($$),
        this._renderContextSection($$)
      )
    )
    return el
  }

  _renderContextSection($$) {
    return $$('div').addClass('se-context-section').append(
      $$(TOC)
    )
  }

  _renderMainSection($$) {
    let SplitPane = this.componentRegistry.get('split-pane')
    let mainSection = $$('div').addClass('se-main-section')
    let splitPane = $$(SplitPane, {splitType: 'horizontal'}).append(
      this._renderToolbar($$),
      this._renderContentPanel($$)
    );
    mainSection.append(splitPane)
    return mainSection
  }

  _renderContentPanel($$) {
    let doc = this.editorSession.getDocument()
    let Layout = this.componentRegistry.get('layout')
    let ScrollPane = this.componentRegistry.get('scroll-pane')

    let contentPanel = $$(ScrollPane, {
      tocProvider: this.tocProvider,
      scrollbarType: 'substance',
      scrollbarPosition: 'left',
      highlights: this.contentHighlights
    }).ref('contentPanel')

    let layout = $$(Layout, {
      width: 'large'
    })

    let ArticleComponent = this.componentRegistry.get('article')

    let article = doc.get('article')
    layout.append(
      $$(ArticleComponent, {
        node: article,
        bodyId: 'body',
        disabled: this.props.disabled,
        configurator: this.props.configurator
      })
    )
    contentPanel.append(layout)
    return contentPanel
  }

  _scrollTo(nodeId) {
    this.refs.contentPanel.scrollTo(nodeId)
  }

  _getExporter() {
    return this.props.configurator.createExporter('jats')
  }

  _getTOCProvider() {
    return new PublisherTOCProvider(this.editorSession)
  }
}

export default Publisher
