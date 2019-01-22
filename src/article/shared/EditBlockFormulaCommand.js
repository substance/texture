import { Command } from 'substance'

export default class EditBlockFormulaCommand extends Command {
  getCommandState (params, context) {
    let sel = params.selection
    let newState = {
      disabled: true,
      active: false
    }

    if (sel.isNodeSelection()) {
      const selectionState = params.selectionState
      const node = selectionState.node
      if (node.type === 'block-formula') {
        newState.disabled = false
        newState.nodeId = node.id
      }
    }

    return newState
  }

  execute (params, context) { } // eslint-disable-line no-unused
}
