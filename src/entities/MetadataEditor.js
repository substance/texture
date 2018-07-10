import { Component } from 'substance'
import CollectionEditor from './CollectionEditor'
import ArticleAPI from '../article/ArticleAPI'

const SECTIONS = [
  { label: 'Authors', collection: 'authors' },
  { label: 'References', collection: 'references' }
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

  didMount() {
    const pubMetaDb = this.api.pubMetaDb
    pubMetaDb.on('change', this.rerender, this)
    this.handleActions({
      'collection:add': this._addToCollection,
      'collection:update': this._updateCollection,
      'collection:remove': this._removeFromCollection
    })
  }

  dispose() {
    const pubMetaDb = this.api.pubMetaDb
    pubMetaDb.off(this)
  }

  render($$) {
    let el = $$('div').addClass('sc-metadata-editor')

    let tocEl = $$('div').addClass('se-toc')
    let collectionsEl = $$('div').addClass('se-collections')

    SECTIONS.forEach(section => {
      tocEl.append(
        $$('a').addClass('se-toc-item')
          .attr({href: '#' + section.collection})
          .append(section.label)
      )
      collectionsEl.append(
        $$(CollectionEditor, { collection: section.collection })
          .attr({id: section.collection})
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

  _addToCollection(col, item) {
    const api = this.api
    api.addToCollection(col, item)
  }

  _updateCollection(col, itemId, data) {
    const api = this.api
    api.updateCollection(col, itemId, data)
  }

  _removeFromCollection(col, itemId) {
    const api = this.api
    api.removeFromCollection(col, itemId)
  }
}









