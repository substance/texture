import { DefaultDOMElement, Component } from 'substance'

import ArticleHeaderComponent from './ArticleHeaderComponent'
import ArticleAbstractComponent from './ArticleAbstractComponent'
import ArticleBodyComponent from './ArticleBodyComponent'
import BibliographyComponent from './BibliographyComponent'

export default class ArticleReader extends Component {
  render($$) {
    const el = $$('div').addClass('sc-article-reader')
    const api = this.context.api

    el.append(
      $$(ArticleHeaderComponent, {
        title: api.getArticleTitle(),
        contribs: api.getContribs(),
        disabled: true
      }).ref('articleHeader'),
      $$('div').addClass('main-content').append(
        $$(ArticleAbstractComponent, {
          model: api.getArticleAbstract(),
          disabled: true
        }).ref('articleAbstract'),
        $$(ArticleBodyComponent, {
          model: api.getArticleBody(),
          disabled: true
        }).ref('articleBody'),
        // TODO: bibliography should become a managed app state
        $$(BibliographyComponent, {
          bibliography: api.getReferences().getBibliography()
        }).ref('bibliography')
      )
    )
    return el
  }

  getConfigurator() {
    return this.props.editorSession.configurator
  }

  _dispose() {
    let doc = this.editorSession.getDocument()
    super._dispose()
    DefaultDOMElement.getBrowserWindow().off(this)
    this.tocProvider.off(this)
    delete doc.referenceManager
  }

  _getTOCProvider() {
    // AbstractWriter requires this
    // TODO: get rid of AbstractWriter
  }

  _getExporter() {
    // AbstractWriter requires this
    // TODO: get rid of AbstractWriter
  }
}
