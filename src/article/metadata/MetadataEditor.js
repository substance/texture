import { Component, DefaultDOMElement } from 'substance'
import { Managed, OverlayCanvas } from '../../kit'
import MetadataModel from './MetadataModel'
import MetadataSection from './MetadataSection'
import MetadataSectionTOCEntry from './MetadataSectionTOCEntry'
import ExperimentalArticleValidator from '../ExperimentalArticleValidator'

export default class MetadataEditor extends Component {
  constructor (...args) {
    super(...args)

    this._initialize(this.props)
  }

  _initialize (props) {
    this.articleValidator = new ExperimentalArticleValidator(this.context.api)
    this.model = new MetadataModel(this.context.editorSession)

    // HACK: this is making all properties dirty, so we have to reset the appState after that
    this.articleValidator.initialize()
    this.context.appState._reset()
  }

  didMount () {
    this._showHideTOC()
    DefaultDOMElement.getBrowserWindow().on('resize', this._showHideTOC, this)
  }

  dispose () {
    this.articleValidator.dispose()
    DefaultDOMElement.getBrowserWindow().off(this)
  }

  render ($$) {
    let el = $$('div').addClass('sc-metadata-editor')
    el.append(
      this._renderMainSection($$)
    )
    el.on('keydown', this._onKeydown)
    return el
  }

  _renderMainSection ($$) {
    let mainSection = $$('div').addClass('se-main-section')
    mainSection.append(
      this._renderToolbar($$),
      $$('div').addClass('se-content-section').append(
        this._renderTOCPane($$),
        this._renderContentPanel($$)
      // TODO: do we need this ref?
      ).ref('contentSection')
    )
    return mainSection
  }

  _renderToolbar ($$) {
    const Toolbar = this.getComponent('toolbar')
    let config = this.context.config
    const items = config.getToolPanel('toolbar')
    return $$('div').addClass('se-toolbar-wrapper').append(
      $$(Managed(Toolbar), {
        items,
        bindings: ['commandStates']
      }).ref('toolbar')
    )
  }

  _renderTOCPane ($$) {
    const sections = this.model.getSections()
    let el = $$('div').addClass('se-toc-pane').ref('tocPane')
    let tocEl = $$('div').addClass('se-toc')
    sections.forEach(({ name, model }) => {
      let id = model.id
      tocEl.append(
        $$(MetadataSectionTOCEntry, {
          id,
          name,
          model
        })
      )
    })
    el.append(tocEl)
    return el
  }

  _renderContentPanel ($$) {
    const sections = this.model.getSections()
    const ScrollPane = this.getComponent('scroll-pane')

    let contentPanel = $$(ScrollPane, {
      contextMenu: 'custom',
      scrollbarPosition: 'right'
    // NOTE: this ref is needed to access the root element of the editable content
    }).ref('contentPanel')

    let sectionsEl = $$('div').addClass('se-sections')

    sections.forEach(({ name, model }) => {
      let content = $$(MetadataSection, { name, model }).ref(name)
      sectionsEl.append(content)
    })

    contentPanel.append(
      sectionsEl.ref('sections'),
      this._renderMainOverlay($$),
      this._renderContextMenu($$)
    )

    return contentPanel
  }

  _renderMainOverlay ($$) {
    const panelProvider = () => this.refs.contentPanel
    return $$(OverlayCanvas, {
      panelProvider,
      theme: this._getTheme()
    }).ref('overlay')
  }

  _renderContextMenu ($$) {
    const config = this.context.config
    const ContextMenu = this.getComponent('context-menu')
    const items = config.getToolPanel('context-menu')
    return $$(Managed(ContextMenu), {
      items,
      theme: this._getTheme(),
      bindings: ['commandStates']
    })
  }

  _getContentPanel () {
    return this.refs.contentPanel
  }

  _getTheme () {
    return 'dark'
  }

  _onKeydown (e) {
    let handled = this.context.keyboardManager.onKeydown(e, this.context)
    if (handled) {
      e.stopPropagation()
      e.preventDefault()
    }
    return handled
  }

  _scrollElementIntoView (el, force) {
    this._getContentPanel().scrollElementIntoView(el, !force)
  }

  _scrollTo (params) {
    let selector
    if (params.nodeId) {
      selector = `[data-id="${params.nodeId}"]`
    } else if (params.section) {
      selector = `[data-section="${params.section}"]`
    } else {
      throw new Error('Illegal argument')
    }
    let comp = this.refs.contentPanel.find(selector)
    if (comp) {
      this._scrollElementIntoView(comp.el, true)
    }
  }

  _showHideTOC () {
    let contentSectionWidth = this.refs.contentSection.el.width
    if (contentSectionWidth < 960) {
      this.el.addClass('sm-compact')
    } else {
      this.el.removeClass('sm-compact')
    }
  }
}
