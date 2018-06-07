import { DefaultDOMElement } from 'substance'
import { AbstractWriter } from '../../editor/util'

import ArticleHeaderComponent from '../../shared/components/ArticleHeaderComponent'
import ArticleAbstractComponent from '../../shared/components/ArticleAbstractComponent'
import ArticleBodyComponent from '../../shared/components/ArticleBodyComponent'
import ArticleReferencesComponent from '../../shared/components/ArticleReferencesComponent'

export default class ArticleReader extends AbstractWriter {

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
        $$(ArticleReferencesComponent, {
          model: api.getReferences()
        }).ref('articleReferences')
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
