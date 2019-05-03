import { Command, documentHelpers } from 'substance'

export default class RemoveKeywordCommand extends Command {
  getCommandState (params, context) {
    return { disabled: false }
  }

  execute (params, context) {
    const { path, nodeId, surfaceId } = params
    const editorSession = context.editorSession
    editorSession.transaction(tx => {
      const index = tx.get(path).indexOf(nodeId)
      const size = tx.get(path).length
      if (index === -1) return false

      documentHelpers.removeAt(tx, path, index)
      documentHelpers.deepDeleteNode(nodeId)
      // NOTE: After removing keyword selection should be moved to
      // the next reasonable place: next keyword value or new keyword input
      if (index < size - 1) {
        const nextNodeId = tx.get(path)[index]
        tx.setSelection({
          type: 'property',
          path: [nextNodeId, 'content'],
          surfaceId,
          startOffset: 0
        })
      } else {
        tx.setSelection({
          type: 'custom',
          customType: 'keywordInput',
          nodeId,
          data: { isExpanded: true },
          surfaceId
        })
      }
    })
  }
}
