import EditMetadataWorkflow from '../metadata/EditMetadataWorkflow'

export default class AddEntityWorkflow extends EditMetadataWorkflow {
  didMount () {
    super.didMount()

    this._createContent()
  }

  _createContent () {
    throw new Error('This method is abstract.')
  }
}
