import { DefaultDOMElement } from 'substance'
import { Managed, OverlayCanvas } from '../../kit'
import EditorPanel from '../shared/EditorPanel'
import MetadataModel from './MetadataModel'
import MetadataSection from './MetadataSection'
import MetadataSectionTOCEntry from './MetadataSectionTOCEntry'
import ExperimentalArticleValidator from '../ExperimentalArticleValidator'

export default class MetadataEditor extends EditorPanel {
  _initialize (props) {
    super._initialize(props)

    this.articleValidator = new ExperimentalArticleValidator(this.api)
    this.model = new MetadataModel(this.editorSession)

    // HACK: this is making all properties dirty, so we have to reset the appState after that
    this.articleValidator.initialize()
    this.appState._reset()
  }

  didMount () {
    super.didMount()
    this._showHideTOC()
    this._restoreViewport()
    DefaultDOMElement.getBrowserWindow().on('resize', this._showHideTOC, this)
  }

  didUpdate () {
    super.didUpdate()
    this._restoreViewport()
  }

  dispose () {
    super.dispose()
    this.articleValidator.dispose()
    DefaultDOMElement.getBrowserWindow().off(this)
  }

  getViewport () {
    return {
      x: this.refs.contentPanel.getScrollPosition()
    }
  }

  render ($$) {
    let el = $$('div').addClass('sc-metadata-editor')
    el.append(
      this._renderMainSection($$)
    )
    el.on('keydown', this._onKeydown)
    return el
  }

  setSelection (sel) {
    let editorSession = this.editorSession
    editorSession.setSelection(sel)
  }

  _renderMainSection ($$) {
    const appState = this.context.appState
    let mainSection = $$('div').addClass('se-main-section')
    mainSection.append(
      this._renderToolbar($$),
      $$('div').addClass('se-content-section').append(
        this._renderTOCPane($$),
        this._renderContentPanel($$)
      // TODO: do we need this ref?
      ).ref('contentSection'),
      this._renderFooterPane($$)
    )
    if (appState.workflowId) {
      mainSection.append(
        this._renderWorkflow($$, appState.workflowId)
      )
    }
    return mainSection
  }

  _renderToolbar ($$) {
    const Toolbar = this.getComponent('toolbar')
    let config = this.props.config
    const items = config.getToolPanel('toolbar')
    return $$('div').addClass('se-toolbar-wrapper').append(
      $$(Managed(Toolbar), {
        items,
        bindings: ['commandStates']
      // TODO: do we need this ref?
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
      let SectionComponent = this._getSectionComponent(name, model)
      let content = $$(SectionComponent, { name, model }).ref(name)
      sectionsEl.append(content)
    })

    contentPanel.append(
      sectionsEl.ref('sections'),
      this._renderMainOverlay($$)
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

  _getSectionComponent (name, model) {
    return MetadataSection
  }

  _renderFooterPane ($$) {
    const FindAndReplaceDialog = this.getComponent('find-and-replace-dialog')
    let el = $$('div').addClass('se-footer-pane')
    el.append(
      $$(FindAndReplaceDialog, {
        theme: this._getTheme(),
        viewName: 'metadata'
      // TODO: do we need this ref?
      }).ref('findAndReplace')
    )
    return el
  }

  _getContentPanel () {
    return this.refs.contentPanel
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
