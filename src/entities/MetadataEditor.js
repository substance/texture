import { Component } from 'substance'
import CollectionEditor from './CollectionEditor'
import ArticleAPI from '../article/ArticleAPI'

const SECTIONS = [
  // { label: 'Authors', collection: 'authors' },
  { label: 'Groups', modelType: 'groups' },
  { label: 'References', modelType: 'references' }
]


/*
  Example props:

  {
    sections: [
      { label: 'Authors', collection: 'authors' },
      { label: 'Editors', collection: 'editors' }
    ]
  }
*/
export default class MetadataEditor extends Component {

  constructor (...args) {
    super(...args)

    this._initialize(this.props)
  }

  _initialize (props) {
    const articleSession = props.articleSession
    const pubMetaDbSession = props.pubMetaDbSession
    const config = props.config
    const api = new ArticleAPI(config, articleSession, pubMetaDbSession, this.context)

    this.api = api
  }

  render($$) {
    let el = $$('div').addClass('sc-metadata-editor')
    let tocEl = $$('div').addClass('se-toc')
    let collectionsEl = $$('div').addClass('se-collections')
    

    SECTIONS.forEach(section => {
      let model = this.api.getModel(section.modelType)
      tocEl.append(
        $$('a').addClass('se-toc-item')
          .attr({ href: '#' + model.id })
          .append(section.label)
      )
      collectionsEl.append(
        $$(CollectionEditor, { model: model })
          .attr({id: model.id})
      )
    })

    el.append(
      tocEl,
      collectionsEl
    )

    return el
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
}









