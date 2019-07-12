import { Command } from 'substance'
import { AddEntityCommand } from '../commands'

export class AddAffiliationCommand extends AddEntityCommand {
  execute (params, context) {
    context.api.addAffiliation()
  }
}

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

export class AddEditorCommand extends AddEntityCommand {
  execute (params, context) {
    context.api.addEditor()
  }
}

export class AddGroupCommand extends AddEntityCommand {
  execute (params, context) {
    context.api.addGroup()
  }
}

export class AddFunderCommand extends AddEntityCommand {
  execute (params, context) {
    context.api.addFunder()
  }
}

export class AddKeywordCommand extends AddEntityCommand {
  execute (params, context) {
    context.api.addKeyword()
  }
}

export class AddSubjectCommand extends AddEntityCommand {
  execute (params, context) {
    context.api.addSubject()
  }
}

class _CardCommand extends Command {
  getCommandState (params, context) {
    let appState = context.appState
    let sel = appState.selection
    if (sel && sel.customType === 'card') {
      let node = appState.selectionState.node
      if (this._canApplyCommand(context, node)) {
        return {
          disabled: false,
          nodeId: node.id,
          label: this._getLabel(context, node)
        }
      }
    }
    return { disabled: true }
  }

  _canApplyCommand (context, node) {
    throw new Error('This method is abstract')
  }

  _getLabel (context, node) {
    throw new Error('This method is abstract')
  }
}

export class RemoveEntityCommand extends _CardCommand {
  execute (params, context) {
    let commandState = params.commandState
    let nodeId = commandState.nodeId
    context.api.removeEntity(nodeId)
  }

  _canApplyCommand (context, node) {
    return context.api.canRemoveEntity(node)
  }

  _getLabel (context, node) {
    let labelProvider = context.labelProvider
    return `${labelProvider.getLabel('remove-something', { something: labelProvider.getLabel(node.type) })}`
  }
}

export class MoveEntityUpCommand extends _CardCommand {
  execute (params, context) {
    let commandState = params.commandState
    let nodeId = commandState.nodeId
    context.api.moveEntityUp(nodeId)
  }

  _canApplyCommand (context, node) {
    return context.api.canMoveEntityUp(node)
  }

  _getLabel (context, node) {
    let labelProvider = context.labelProvider
    return `${labelProvider.getLabel('move-something-up', { something: labelProvider.getLabel(node.type) })}`
  }
}

export class MoveEntityDownCommand extends _CardCommand {
  execute (params, context) {
    let commandState = params.commandState
    let nodeId = commandState.nodeId
    context.api.moveEntityDown(nodeId)
  }

  _canApplyCommand (context, node) {
    return context.api.canMoveEntityDown(node)
  }

  _getLabel (context, node) {
    let labelProvider = context.labelProvider
    return `${labelProvider.getLabel('move-something-down', { something: labelProvider.getLabel(node.type) })}`
  }
}
