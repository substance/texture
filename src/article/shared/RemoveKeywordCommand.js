import { Command, documentHelpers } from 'substance'

export default class RemoveKeywordCommand extends Command {
  getCommandState (params, context) {
    const xpath = params.selectionState.xpath
    if (xpath.length > 0) {
      const selectedType = xpath[xpath.length - 1].type
      if (selectedType === 'custom-metadata-value') {
        return { disabled: false }
      }
    }
    return { disabled: true }
  }

  execute (params, context) {
    const selectionState = params.selectionState
    const node = selectionState.node
    const nodeId = node.id
    const parentNode = node.getParent()
    const path = [parentNode.id, 'values']
    const editorSession = context.editorSession

    editorSession.transaction(tx => {
      const index = tx.get(path).indexOf(nodeId)
      documentHelpers.removeAt(tx, path, index)
      documentHelpers.deepDeleteNode(nodeId)
      tx.setSelection(null)
    })
  }
}
