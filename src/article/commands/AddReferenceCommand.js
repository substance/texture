import AddEntityCommand from './AddEntityCommand'

export default class AddAuthorCommand extends AddEntityCommand {
  execute (params, context) {
    context.editor.send('startWorkflow', 'add-reference-workflow')
  }
}
