import { SplitPane, ScrollPane, Layout, ProseEditorOverlayTools, TOC } from 'substance'
import AbstractWriter from '../common/AbstractWriter'
import AuthorTOCProvider from './AuthorTOCProvider'

class Author extends AbstractWriter {

  render($$) {
    let el = $$('div').addClass('sc-author')
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
    let mainSection = $$('div').addClass('se-main-sectin')
    let splitPane = $$(SplitPane, {splitType: 'horizontal'}).append(
      // inherited from  ProseEditor
      this._renderToolbar($$),
      this._renderContentPanel($$)
    )
    mainSection.append(splitPane)
    return mainSection
  }

  _renderContentPanel($$) {
    const doc = this.documentSession.getDocument()
    const ArticleComponent = this.componentRegistry.get('article')
    const article = doc.get('article')

    let contentPanel = $$(ScrollPane, {
      tocProvider: this.tocProvider,
      scrollbarType: 'substance',
      scrollbarPosition: 'left',
      overlay: ProseEditorOverlayTools,
    }).ref('contentPanel')

    let layout = $$(Layout, {
      width: 'large'
    })

    layout.append(
      $$(ArticleComponent, {
        node: article,
        bodyId: 'bodyFlat',
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
    return new AuthorTOCProvider(this.documentSession)
  }

}

export default Author
