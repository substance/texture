import InsertNodeCommand from './InsertNodeCommand'

/*
  This command is opening a workflow when it is possible to insert a node.
  Use it when you want to insert a node after additional workflow step.
*/
export default class InsertNodeFromWorkflowCommand extends InsertNodeCommand {
  execute (params, context) {
    const workflow = this.config.workflow
    context.editor.send('startWorkflow', workflow)
  }
}
