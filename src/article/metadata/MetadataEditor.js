import { DefaultDOMElement } from 'substance'
import { Managed } from '../../kit'
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

    // ATTENTION/HACK: this is making all properties dirty, so we have to reset the appState after that
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

  _createModelSelection (modelId) {
    return {
      type: 'custom',
      customType: 'model',
      nodeId: modelId,
      data: {
        modelId
      }
    }
  }

  _renderMainSection ($$) {
    const appState = this.context.appState
    let mainSection = $$('div').addClass('se-main-section')
    mainSection.append(
      this._renderToolbar($$),
      $$('div').addClass('se-content-section').append(
        this._renderTOCPane($$),
        this._renderContentPanel($$)
      ).ref('contentSection'),
      this._renderFooterPane($$)
    )
    if (appState.workflowId) {
      let Modal = this.getComponent('modal')
      let WorkflowComponent = this.getComponent(appState.workflowId)
      let workflowModal = $$(Modal, {
        width: 'large'
      }).addClass('se-workflow-modal').append(
        $$(WorkflowComponent).ref('workflow')
      )
      mainSection.append(workflowModal)
    }
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
    const sections = this.model.getSections()

    let el = $$('div').addClass('se-toc-pane').ref('tocPane')
    let tocEl = $$('div').addClass('se-toc')

    sections.forEach(({name, model}) => {
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
      scrollbarPosition: 'right'
    }).ref('contentPanel')

    let sectionsEl = $$('div').addClass('se-sections')

    sections.forEach(({name, model}) => {
      let SectionComponent = this._getSectionComponent(name, model)
      let content = $$(SectionComponent, { name, model }).ref(name)
      sectionsEl.append(content)
    })

    contentPanel.append(sectionsEl)

    return contentPanel
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
