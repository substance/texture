import { Command } from 'substance'

export default class EditEntityCommand extends Command {
  getCommandState (params, context) {
    let selectionState = context.appState.selectionState
    let node = selectionState.node
    if (node && node.isInstanceOf(this._getType())) {
      return {
        disabled: false,
        node
      }
    } else {
      return { disabled: true }
    }
  }

  execute (params, context) {
    // TODO: this might not be general enough, maybe we could introduce edit-entity-workflow
    // which could just be derived from edit-metadata-workflow
    let commandState = params.commandState
    context.editor.send('startWorkflow', 'edit-metadata-workflow', { nodeId: commandState.node.id })
  }

  _getType () {
    throw new Error('This is abstract')
  }
}
