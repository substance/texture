import TableCellCommand from './TableCellCommand'

export default class RemoveColumnCommand extends TableCellCommand {
  execute(params, context) {
    const editorSession = context.editorSession
    editorSession.transaction(tx => {
      const nodeId = params.selection.getNodeId()
      const node = tx.get(nodeId)
      const row = node.parentNode
      const colNumber = row.getChildNodes().indexOf(node)
      const tableBody = row.parentNode
      const table = tableBody.parentNode
      const tableHeadRow = table.getFirstChild().find('tr')
      const tableHead = tableHeadRow.getChildAt(colNumber)
      tableHeadRow.removeChild(tableHead)

      let it = tableBody.getChildNodeIterator()
      while(it.hasNext()) {
        let nextRow = it.next()
        let cell = nextRow.getChildAt(colNumber)
        nextRow.removeChild(cell)
      }
    })
  }
}
