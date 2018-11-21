import { Command } from 'substance'

class EditDispFormulaCommand extends Command {
  getCommandState (params) {
    let doc = params.editorSession.getDocument()
    let sel = params.selection
    let commandState = {
      disabled: true
    }

    if (sel.isNodeSelection()) {
      let node = doc.get(sel.nodeId)
      if (node && node.type === 'disp-formula') {
        commandState.active = true
        commandState.disabled = false
        commandState.nodeId = sel.nodeId
      }
    }
    return commandState
  }

  execute (params) {}
}

export default EditDispFormulaCommand
