import { SplitPane, ScrollPane, Layout, TOC } from 'substance'
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
    let mainSection = $$('div').addClass('se-main-section')
    let splitPane = $$(SplitPane, {splitType: 'horizontal'}).append(
      this._renderToolbar($$),
      this._renderContentPanel($$)
    )
    mainSection.append(splitPane)
    return mainSection
  }

  _renderContentPanel($$) {
    const doc = this.editorSession.getDocument()
    const ArticleComponent = this.componentRegistry.get('article')
    const Overlay = this.componentRegistry.get('overlay')
    const ContextMenu = this.componentRegistry.get('context-menu')
    const DropTeaser = this.componentRegistry.get('drop-teaser')

    const article = doc.get('article')

    let contentPanel = $$(ScrollPane, {
      tocProvider: this.tocProvider,
      scrollbarType: 'substance',
      scrollbarPosition: 'left',
      highlights: this.contentHighlights,
      // contextMenu: 'custom'
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

    contentPanel.append(
      layout,
      $$(Overlay),
      $$(ContextMenu),
      $$(DropTeaser)
    )
    return contentPanel
  }

  _scrollTo(nodeId) {
    this.refs.contentPanel.scrollTo(nodeId)
  }

  _getExporter() {
    return this.props.configurator.createExporter('jats')
  }

  _getTOCProvider() {
    return new AuthorTOCProvider(this.editorSession)
  }

}

export default Author
