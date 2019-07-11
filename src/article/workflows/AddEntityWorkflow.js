import EditMetadataWorkflow from '../metadata/EditMetadataWorkflow'

export default class AddEntityWorkflow extends EditMetadataWorkflow {
  didMount () {
    super.didMount()

    // ATTENTION: we need to wait until everything is mounted
    // before changing the model
    setTimeout(() => {
      this._createContent()
    })
  }

  _createContent () {
    throw new Error('This method is abstract.')
  }
}
