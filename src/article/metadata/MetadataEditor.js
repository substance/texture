import { Component } from 'substance'
import { Managed } from '../../shared'
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
    const { articleSession, pubMetaDbSession, config } = props
    const api = new ArticleAPI(config, articleSession, pubMetaDbSession, this.context)

    // HACK: we need to be careful with leaking context
    // TODO: maybe we should add Component.defineContext()
    // which will not inherit parent context automatically
    let context = Object.assign({}, super._getContext(), {
      componentRegistry: config.getComponentRegistry()
    })
    this.api = api
    this.context = context
  }

  getChildContext () {
    const api = this.api
    const articleSession = this.props.articleSession
    const pubMetaDbSession = this.props.pubMetaDbSession
    const config = this.props.config
    const componentRegistry = config.getComponentRegistry()
    const commandManager = api.commandManager
    const dragManager = api.dragManager
    const referenceManager = api.getReferenceManager()
    const surfaceManager = articleSession.surfaceManager
    const markersManager = articleSession.markersManager
    const commandGroups = config.getCommandGroups()
    const tools = config.getTools()
    const labelProvider = config.getLabelProvider()
    const keyboardShortcuts = config.getKeyboardShortcuts()
    const iconProvider = config.getIconProvider()
    return {
      api,
      configurator: config,
      componentRegistry,
      referenceManager,
      // legacy
      editorSession: articleSession,
      pubMetaDbSession,
      // TODO: make the context footprint smaller
      commandManager,
      commandGroups,
      dragManager,
      iconProvider,
      keyboardShortcuts,
      labelProvider,
      surfaceManager,
      markersManager,
      tocProvider: this.tocProvider,
      tools
    }
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
    let config = this._getConfig()
    return $$('div').addClass('se-toolbar-wrapper').append(
      $$(Managed(Toolbar), {
        toolPanel: config.getToolPanel('toolbar'),
        bindings: ['commandStates']
      }).ref('toolbar')
    )
  }

  _renderTOCPane ($$) {
    let el = $$('div').addClass('se-toc-pane').ref('tocPane')
    let tocEl = $$('div').addClass('se-toc')
    SECTIONS.forEach(section => {
      let model = this.api.getModel(section.modelType)
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
    const ScrollPane = this.getComponent('scroll-pane')

    let contentPanel = $$(ScrollPane, {
      scrollbarPosition: 'right'
    }).ref('contentPanel')

    let collectionsEl = $$('div').addClass('se-collections')
    SECTIONS.forEach(section => {
      let model = this.api.getModel(section.modelType)

      if(model.isCollection) {
        collectionsEl.append(
          $$(CollectionEditor, { model: model })
            .attr({id: model.id})
            .ref(model.id)
        )
      } else if (section.modelType === 'article-record') {
        model = this.api.getEntity('article-record')
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

  _getConfig () {
    return this.props.config
  }
}
