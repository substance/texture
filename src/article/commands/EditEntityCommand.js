import { Command } from 'substance'

export default class EditEntityCommand extends Command {
  getCommandState (params, context) {
    let sel = params.selection
    let newState = {
      disabled: true
    }
    if (sel.isCustomSelection()) {
      if (sel.customType === this.config.selectionType) {
        newState.disabled = false
        newState.nodeId = sel.nodeId
      }
    }
    return newState
  }

  execute (params, context) {
    console.error('TODO: bring back editing of entities')
  }
}
