import { Command } from 'substance'

export default class TableCellCommand extends Command {
  getCommandState(params) {
    const sel = params.selection
    let state = {
      disabled: true
    }
    if(sel.isPropertySelection()) {
      const editorSession = params.editorSession
      const doc = editorSession.getDocument()
      const nodeId = params.selection.getNodeId()
      const node = doc.get(nodeId)
      if(node.type === 'td') {
        state.disabled = false
      }
    }
    return state
  }
}
