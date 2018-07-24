import { Component } from 'substance'
import {
  Managed, createEditorContext
} from '../../shared'
import ArticleEditorSession from '../ArticleEditorSession'
import ArticleAPI from '../ArticleAPI'
import CollectionEditor from './CollectionEditor'
import EntityEditor from './EntityEditor'

const SECTIONS = [
  { label: 'Authors', modelType: 'authors' },
  { label: 'Translations', modelType: 'translatables' },
  { label: 'Editors', modelType: 'editors' },
  { label: 'Groups', modelType: 'groups' },
  { label: 'Affiliations', modelType: 'organisations' },
  { label: 'Awards', modelType: 'awards' },
  { label: 'Figures', modelType: 'figures' },
  { label: 'Footnotes', modelType: 'footnotes' },
  { label: 'References', modelType: 'references' },
  { label: 'Keywords', modelType: 'keywords' },
  { label: 'Subjects', modelType: 'subjects' },
  { label: 'Article', modelType: 'article-record' }
]

export default class MetadataEditor extends Component {
  constructor (...args) {
    super(...args)

    this._initialize(this.props)
  }

  _initialize (props) {
    const { articleSession, config, archive } = props
    const editorSession = new ArticleEditorSession(articleSession.getDocument(), config, this)
    const api = new ArticleAPI(editorSession, config.getModelRegistry())
    this.api = api
    this.editorSession = editorSession
    this.context = Object.assign(createEditorContext(config, editorSession), {
      api,
      urlResolver: archive
    })
  }

  dispose () {
    const articleSession = this.props.articleSession
    const editorSession = this.editorSession
    articleSession.off(this)
    editorSession.dispose()
    // Note: we need to clear everything, as the childContext
    // changes which is immutable
    this.empty()
  }

  render ($$) {
    let el = $$('div').addClass('sc-metadata-editor')
    el.append(
      this._renderMainSection($$),
      this._renderContextPane($$)
    )
    return el
  }

  _renderMainSection ($$) {
    const Modal = this.getComponent('modal')
    const WorkflowPane = this.getComponent('workflow-pane')
    let mainSection = $$('div').addClass('se-main-section')
    mainSection.append(
      this._renderToolbar($$),
      $$('div').addClass('se-content-section').append(
        this._renderTOCPane($$),
        this._renderContentPanel($$)
      )
    )
    let workflowModal = $$(Modal).addClass('se-workflow-modal').append(
      $$(WorkflowPane).ref('workflowPane')
    )
    // TODO: show modal if workflow state is set
    workflowModal.addClass('sm-hidden')

    mainSection.append(workflowModal)

    return mainSection
  }

  _renderToolbar ($$) {
    const Toolbar = this.getComponent('toolbar')
    let config = this.props.config
    return $$('div').addClass('se-toolbar-wrapper').append(
      $$(Managed(Toolbar), {
        toolPanel: config.getToolPanel('toolbar'),
        bindings: ['commandStates']
      }).ref('toolbar')
    )
  }

  _renderTOCPane ($$) {
    const api = this.api
    let el = $$('div').addClass('se-toc-pane').ref('tocPane')
    let tocEl = $$('div').addClass('se-toc')
    SECTIONS.forEach(section => {
      let model = api.getModel(section.modelType)
      if(model.isCollection) {
        const items = model.getItems()
        tocEl.append(
          $$('a').addClass('se-toc-item')
            .attr({ href: '#' + model.id })
            .append(section.label + ' (' + items.length + ')')
        )
      } else {
        tocEl.append(
          $$('a').addClass('se-toc-item')
            .attr({ href: '#' + model.id })
            .append(section.label)
        )
      }
    })
    el.append(tocEl)
    return el
  }

  _renderContentPanel ($$) {
    const api = this.api
    const ScrollPane = this.getComponent('scroll-pane')

    let contentPanel = $$(ScrollPane, {
      scrollbarPosition: 'right'
    }).ref('contentPanel')

    let collectionsEl = $$('div').addClass('se-collections')
    SECTIONS.forEach(section => {
      let model = api.getModel(section.modelType)
      if(model.isCollection) {
        collectionsEl.append(
          $$(CollectionEditor, { model: model })
            .attr({id: model.id})
            .ref(model.id)
        )
      } else if (section.modelType === 'article-record') {
        model = api.getEntity('article-record')
        collectionsEl.append(
          $$(EntityEditor, { model: model })
            .attr({id: model.id})
            .ref(model.id)
        )
      }
    })

    contentPanel.append(collectionsEl)

    return contentPanel
  }

  _renderContextPane ($$) { // eslint-disable-line no-unused-vars
    // TODO: here we would instanstiate the issue panel for instance
  }
}
