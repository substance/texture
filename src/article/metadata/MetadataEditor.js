import { Component } from 'substance'
import { Managed, createEditorContext } from '../../kit'
import MetadataModel from '../models/MetadataModel'
import ArticleEditorSession from '../ArticleEditorSession'
import ArticleAPI from '../ArticleAPI'
import MetadataSection from './MetadataSection'
import MetadataSectionTOCEntry from './MetadataSectionTOCEntry'
import ExperimentalArticleValidator from '../ExperimentalArticleValidator'

export default class MetadataEditor extends Component {
  constructor (...args) {
    super(...args)

    this.handleActions({
      executeCommand: this._executeCommand,
      toggleOverlay: this._toggleOverlay,
      startWorkflow: this._startWorkflow,
      closeModal: this._closeModal
    })

    this._initialize(this.props)
  }

  // TODO: shouldn't we react on willReceiveProps?
  _initialize (props) {
    const { articleSession, config, archive } = props
    const editorSession = new ArticleEditorSession(
      articleSession.getDocument(), config, this, {
        workflowId: null,
        viewName: this.props.viewName
      }
    )
    const api = new ArticleAPI(editorSession, config.getModelRegistry(), archive)
    this.api = api
    this.editorSession = editorSession
    this.context = Object.assign(createEditorContext(config, editorSession), {
      editor: this,
      api,
      urlResolver: archive,
      editable: true
    })
    this.articleValidator = new ExperimentalArticleValidator(articleSession, editorSession.editorState)
    this.model = new MetadataModel(api)

    // initial reduce etc.
    this.editorSession.initialize()
    this.articleValidator.initialize()

    this.context.appState.addObserver(['workflowId'], this.rerender, this, { stage: 'render' })
    this.context.appState.addObserver(['viewName'], this._updateViewName, this, { stage: 'render' })
  }

  _updateViewName () {
    let appState = this.context.appState
    this.send('updateViewName', appState.viewName)
  }

  dispose () {
    const appState = this.context.appState
    const articleSession = this.props.articleSession
    const editorSession = this.editorSession
    const articleValidator = this.articleValidator
    articleSession.off(this)
    editorSession.dispose()
    articleValidator.dispose()
    appState.removeObserver(this)
    // TODO: do we really need to clear here?
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
    const appState = this.context.appState
    let mainSection = $$('div').addClass('se-main-section')
    mainSection.append(
      this._renderToolbar($$),
      $$('div').addClass('se-content-section').append(
        this._renderTOCPane($$),
        this._renderContentPanel($$)
      )
    )
    if (appState.workflowId) {
      let Modal = this.getComponent('modal')
      let WorkflowComponent = this.getComponent(appState.workflowId)
      let workflowModal = $$(Modal).addClass('se-workflow-modal').append(
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

  _renderContextPane ($$) { // eslint-disable-line no-unused-vars
    // TODO: here we would instanstiate the issue panel for instance
  }

  _executeCommand (name) {
    this.editorSession.executeCommand(name)
  }

  _toggleOverlay (overlayId) {
    const appState = this.context.appState
    if (appState.overlayId === overlayId) {
      appState.overlayId = null
    } else {
      appState.overlayId = overlayId
    }
    appState.propagateUpdates()
  }

  _startWorkflow (workflowId) {
    const appState = this.context.appState
    appState.workflowId = workflowId
    appState.overlayId = workflowId
    appState.propagateUpdates()
  }

  _closeModal () {
    const appState = this.context.appState
    appState.workflowId = null
    appState.overlayId = null
    appState.propagateUpdates()
  }
}
