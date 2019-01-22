import InsertNodeCommand from './InsertNodeCommand'

export default class InsertNodeFromWorkflowCommand extends InsertNodeCommand {
  execute (params, context) {
    const workflow = this.config.workflow
    if (workflow) {
      context.editor.send('startWorkflow', workflow)
    } else {
      context.editor.send('toggleOverlay')
    }
  }
}
