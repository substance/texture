import RemoveItemCommand from './RemoveItemCommand'

export default class RemoveReferenceCommand extends RemoveItemCommand {
  execute (params, context) {
    context.api.removeReference(params.commandState.nodeId)
  }
}
