import TableCellCommand from './TableCellCommand'

export default class RemoveRowCommand extends TableCellCommand {
  execute(params, context) {
    const editorSession = context.editorSession
    editorSession.transaction(tx => {
      const nodeId = params.selection.getNodeId()
      const node = tx.get(nodeId)
      const row = node.parentNode
      const table = row.parentNode
      row.getChildren().forEach(node => {
        tx.delete(node)
      })
      table.removeChild(row)
    })
  }
}
