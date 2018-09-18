import { DefaultDOMElement } from 'substance'
import { Managed } from '../../kit'
import EditorPanel from '../shared/EditorPanel'
import MetadataModel from '../models/MetadataModel'
import MetadataSection from './MetadataSection'
import MetadataSectionTOCEntry from './MetadataSectionTOCEntry'
import ExperimentalArticleValidator from '../ExperimentalArticleValidator'

export default class MetadataEditor extends EditorPanel {
  _initialize (props) {
    super._initialize(props)

    this.articleValidator = new ExperimentalArticleValidator(this.editorSession, this.editorSession.editorState)
    this.model = new MetadataModel(this.api)

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

  _renderMainSection ($$) {
    const appState = this.context.appState
    let mainSection = $$('div').addClass('se-main-section')
    mainSection.append(
      this._renderToolbar($$),
      $$('div').addClass('se-content-section').append(
        this._renderTOCPane($$),
        this._renderContentPanel($$),
        this._renderFooterPane($$)
      ).ref('contentSection')
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
    const model = this.model
    const properties = model.getProperties()

    let el = $$('div').addClass('se-toc-pane').ref('tocPane')
    let tocEl = $$('div').addClass('se-toc')

    properties.forEach(property => {
      let valueModel = property.valueModel
      let id = valueModel.id || property.type
      tocEl.append(
        $$(MetadataSectionTOCEntry, {
          id,
          name: property.name,
          model: valueModel
        })
      )
    })

    el.append(tocEl)
    return el
  }

  _renderContentPanel ($$) {
    const model = this.model
    const properties = model.getProperties()
    const ScrollPane = this.getComponent('scroll-pane')

    let contentPanel = $$(ScrollPane, {
      scrollbarPosition: 'right'
    }).ref('contentPanel')

    let sectionsEl = $$('div').addClass('se-sections')

    properties.forEach(property => {
      let valueModel = property.valueModel
      let id = valueModel.id || property.type
      let content = $$(MetadataSection, { model: valueModel }).attr({id}).ref(property.name)
      sectionsEl.append(content)
    })

    contentPanel.append(sectionsEl)

    return contentPanel
  }

  _renderFooterPane ($$) {
    const FindAndReplaceDialog = this.getComponent('find-and-replace-dialog')
    let el = $$('div').addClass('se-footer-pane')
    el.append(
      $$(FindAndReplaceDialog, {
        theme: this._getTheme()
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
