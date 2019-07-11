import { Component, domHelpers } from 'substance'
import { createEditorContext, ModalEditorSession } from '../../kit'
import MetadataEditor from './MetadataEditor'
import MetadataAPI from './MetadataAPI'

export default class EditMetadataWorkflow extends Component {
  constructor (...args) {
    super(...args)

    this._initialize(this.props)
  }

  _initialize (props) {
    let parentContext = this.getParent().context
    let archive = parentContext.archive
    let parentEditorSession = parentContext.editorSession
    let config = parentContext.config.getConfiguration('metadata')
    let editorSession = new ModalEditorSession('edit-metadata', parentEditorSession, config, this, {
      settings: parentEditorSession.editorState.settings
    })
    let api = new MetadataAPI(editorSession, archive, config, this)
    let editor = this
    const context = Object.assign(createEditorContext(config, editorSession, editor), {
      api,
      editable: true
    })
    // ATTENTION: the editorSession needs to be initialized
    editorSession.initialize()

    this.context = context
    this.api = api
    this.config = config
    this.editorSession = editorSession
  }

  getActionHandlers () {
    return {
      executeCommand: this._executeCommand,
      toggleOverlay: this._toggleOverlay,
      scrollTo: this._scrollTo,
      scrollElementIntoView: this._scrollElementIntoView
    }
  }

  dispose () {
    this.editorSession.dispose()
  }

  render ($$) {
    let el = $$('div').addClass('sc-edit-metadata-worklfow')
    el.append($$(MetadataEditor).ref('editor'))
    // ATTENTION: don't let mousedowns pass, otherwise the parent will null the selection
    el.on('mousedown', domHelpers.stopAndPrevent)
    return el
  }

  getComponentRegistry () {
    return this.config.getComponentRegistry()
  }

  getContentPanel () {
    return this.refs.contentPanel
  }

  _executeCommand (name, params) {
    this.editorSession.executeCommand(name, params)
  }

  _scrollElementIntoView (el, force) {
    this.refs.editor._scrollElementIntoView(el, force)
  }

  _scrollTo (params) {
    this.refs.editor._scrollTo(params)
  }
}
