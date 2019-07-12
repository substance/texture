import { Command } from 'substance'
import { AddEntityCommand } from '../commands'

export class AddAuthorCommand extends AddEntityCommand {
  execute (params, context) {
    context.api.addAuthor()
  }
}

export class AddCustomAbstractCommand extends AddEntityCommand {
  execute (params, context) {
    context.api.addCustomAbstract()
  }
}

export class RemoveEntityCommand extends Command {
  getCommandState (params, context) {
    let appState = context.appState
    let sel = appState.selection
    if (sel && sel.customType === 'card') {
      let node = appState.selectionState.node
      if (context.api.canRemoveEntity(node)) {
        let labelProvider = context.labelProvider
        return {
          disabled: false,
          nodeId: node.id,
          label: `${labelProvider.getLabel('remove-something', { something: labelProvider.getLabel(node.type) })}`
        }
      }
    }
    return { disabled: true }
  }

  execute (params, context) {
    let commandState = params.commandState
    let nodeId = commandState.nodeId
    context.api.removeEntity(nodeId)
  }
}
