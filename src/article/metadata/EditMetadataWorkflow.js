import EditorWorkflow from '../shared/EditorWorkflow'
import MetadataEditor from './MetadataEditor'
import MetadataAPI from './MetadataAPI'

export default class EditMetadataWorkflow extends EditorWorkflow {
  didMount () {
    super.didMount()

    // scroll to the node if a workflow props are given
    // Note: this has to be done after everything as been mounted
    if (this.props.nodeId) {
      setTimeout(() => {
        this.api.selectEntity(this.props.nodeId)
      })
    }
  }

  render ($$) {
    let el = super.render($$)
    el.append(
      // ATTENTION: ATM it is important to use 'editor' ref
      $$(MetadataEditor).ref('editor')
    )
    return el
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
}
