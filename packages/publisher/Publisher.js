import { ProseEditorOverlayTools, TOC } from 'substance'
import AbstractWriter from '../common/AbstractWriter'
import PublisherTOCProvider from './PublisherTOCProvider'

class Publisher extends AbstractWriter {
  render($$) {
    var SplitPane = this.componentRegistry.get('split-pane')
    var el = $$('div').addClass('sc-publisher')
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
    var SplitPane = this.componentRegistry.get('split-pane')
    var mainSection = $$('div').addClass('se-main-section')
    var splitPane = $$(SplitPane, {splitType: 'horizontal'}).append(
      this._renderToolbar($$),
      this._renderContentPanel($$)
    );
    mainSection.append(splitPane)
    return mainSection
  }

  _renderContentPanel($$) {
    var doc = this.documentSession.getDocument()
    var Layout = this.componentRegistry.get('layout')
    var ScrollPane = this.componentRegistry.get('scroll-pane')

    var contentPanel = $$(ScrollPane, {
      tocProvider: this.tocProvider,
      scrollbarType: 'substance',
      scrollbarPosition: 'left',
      overlay: ProseEditorOverlayTools,
      highlights: this.contentHighlights
    }).ref('contentPanel');

    var layout = $$(Layout, {
      width: 'large'
    });

    var ArticleComponent = this.componentRegistry.get('article')

    var article = doc.get('article')
    layout.append(
      $$(ArticleComponent, {
        node: article,
        bodyId: 'body',
        disabled: this.props.disabled,
        configurator: this.props.configurator
      })
    );
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
    return new PublisherTOCProvider(this.documentSession)
  }
}


export default Publisher;
