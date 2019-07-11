import AddEntityWorkflow from './AddEntityWorkflow'

export default class AddAuthorWorkflow extends AddEntityWorkflow {
  _createContent () {
    this.context.api.addAuthor()
  }
}
