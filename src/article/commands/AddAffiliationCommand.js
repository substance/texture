import AddEntityCommand from './AddEntityCommand'

export default class AddAffiliationCommand extends AddEntityCommand {
  execute (params, context) {
    context.editor.send('startWorkflow', 'add-affiliation-workflow')
  }
}
