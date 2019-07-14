import AddEntityCommand from './AddEntityCommand'

export default class AddAuthorCommand extends AddEntityCommand {
  execute (params, context) {
    context.editorSession.getRootComponent().send('startWorkflow', 'add-reference-workflow')
  }
}
