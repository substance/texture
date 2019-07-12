import EditorWorkflow from '../shared/EditorWorkflow'
import MetadataEditor from './MetadataEditor'
import MetadataAPI from './MetadataAPI'

export default class EditMetadataWorkflow extends EditorWorkflow {
  didMount () {
    super.didMount()

    this.appState.addObserver(['selection'], this._onSelectionChange, this, { stage: 'finalize' })

    // scroll to the node if a workflow props are given
    // Note: this has to be done after everything as been mounted
    if (this.props.nodeId) {
      this.api.selectEntity(this.props.nodeId)
    }
  }

  dispose () {
    super.dispose()

    this.appState.removeObserver(this)
  }

  _renderContent ($$) {
    // ATTENTION: ATM it is important to use 'editor' ref
    return $$(MetadataEditor).ref('editor')
  }

  _getClassNames () {
    return 'sc-edit-metadata-workflow sc-editor-workflow'
  }

  _getConfig () {
    return this.getParent().context.config.getConfiguration('metadata')
  }

  _getWorkflowId () {
    return 'edit-metadata-workflow'
  }

  _createAPI () {
    return new MetadataAPI(this.editorSession, this.context.archive, this.config, this)
  }

  _onSelectionChange (sel) {
    if (!sel || sel.isNull() || sel.isCustomSelection()) {
      this.refs.keytrap.el.focus({ preventScroll: true })
    }
  }
}
