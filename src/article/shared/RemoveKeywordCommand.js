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
      // TODO: after removing selection should be
      // moved to the next ‘reasonable’ place
      if (index < size - 1) {
        tx.setSelection({
          type: 'property',
          path: [tx.get(path)[index], 'content'],
          surfaceId: surfaceId,
          startOffset: 0,
          endOffset: 0
        })
      } else {
        tx.selection = null
      }
    })
  }
}
