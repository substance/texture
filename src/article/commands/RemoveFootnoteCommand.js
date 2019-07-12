import RemoveItemCommand from './RemoveItemCommand'

export default class RemoveFootnoteCommand extends RemoveItemCommand {
  execute (params, context) {
    context.api.removeFootnote(params.commandState.nodeId)
  }
}
