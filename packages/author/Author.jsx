import SplitPane from 'substance/ui/SplitPane'
import ScrollPane from 'substance/ui/ScrollPane'
import Layout from 'substance/ui/Layout'
import Overlay from 'substance/ui/DefaultOverlay'
import AbstractWriter from '../common/AbstractWriter'
import AuthorTOCProvider from './AuthorTOCProvider'
import TOC from 'substance/ui/TOC'

class Author extends AbstractWriter {

  render($$) {
    return (
      <div class="sc-author">
        <SplitPane splitType="vertical" sizeA="300px">
          { this._renderContextSection($$) }
          { this._renderMainSection($$) }
        </SplitPane>
      </div>
    )
  }

  _renderContextSection($$) {
    return (
      <div class="se-context-section">
        <TOC />
      </div>
    )
  }

  _renderMainSection($$) {
    return (
      <div class="se-main-section">
        <SplitPane splitType="horizontal">
          { this._renderToolbar($$) }
          { this._renderContentPanel($$) }
        </SplitPane>
      </div>
    )
  }

  _renderContentPanel($$) {
    const doc = this.documentSession.getDocument()
    const article = doc.get('article')
    const ArticleComponent = this.componentRegistry.get('article');
    return (
      <ScrollPane
          tocProvider={this.tocProvider}
          scrollbarType="substance" scrollbarPosition="right"
          overlay={Overlay} ref="contentPanel">
        <Layout width="large">
          <ArticleComponent node={article}
            bodyId="bodyFlat" disabled={this.props.disabled}
            configurator={this.props.configurator} />
        </Layout>
      </ScrollPane>
    )
  }

  _scrollTo(nodeId) {
    this.refs.contentPanel.scrollTo(nodeId)
  }

  _getExporter() {
    return this.props.configurator.createExporter('jats')
  }

  _getTOCProvider() {
    return new AuthorTOCProvider(this.documentSession)
  }

}

export default Author;
