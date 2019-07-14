import AddEntityCommand from './AddEntityCommand'

export default class AddAffiliationCommand extends AddEntityCommand {
  execute (params, context) {
    context.editorSession.getRootComponent().send('startWorkflow', 'add-affiliation-workflow')
  }
}
