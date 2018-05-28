import { DefaultDOMElement } from 'substance'
import { AbstractWriter } from '../../editor/util'
import ReferenceManager from '../../editor/util/ReferenceManager'
import FigureManager from '../../editor/util/FigureManager'
import TableManager from '../../editor/util/TableManager'
import FootnoteManager from '../../editor/util/FootnoteManager'

import TextureArticleAPI from '../../article/TextureArticleAPI'
import ArticleHeaderComponent from '../../shared/components/ArticleHeaderComponent'
import ArticleAbstractComponent from '../../shared/components/ArticleAbstractComponent'
import ArticleBodyComponent from '../../shared/components/ArticleBodyComponent'
import ArticleReferencesComponent from '../../shared/components/ArticleReferencesComponent'

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
    const el = $$('div').addClass('sc-article-reader')
    const api = new TextureArticleAPI(this.editorSession)

    el.append(
      $$(ArticleHeaderComponent, {
        model: api.getArticleTitle()
      }).ref('articleHeader'),
      $$('div').addClass('main-content').append(
        $$(ArticleAbstractComponent, {
          model: api.getArticleAbstract()
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

  _initialize(props) {
    super._initialize(props)
    let editorSession = props.editorSession

    this.referenceManager = new ReferenceManager({
      labelGenerator: editorSession.getConfigurator().getLabelGenerator('references'),
      editorSession,
      pubMetaDbSession: props.pubMetaDbSession
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

  _getTOCProvider() {
    // AbstractWriter requires this
    // TODO: get rid of AbstractWriter
  }

  _getExporter() {
    // AbstractWriter requires this
    // TODO: get rid of AbstractWriter
  }


}
