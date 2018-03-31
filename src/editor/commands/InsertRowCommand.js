import TableCellCommand from './TableCellCommand'

export default class InsertRowCommand extends TableCellCommand {
  execute(params, context) {
    const editorSession = context.editorSession
    editorSession.transaction(tx => {
      const nodeId = params.selection.getNodeId()
      const node = tx.get(nodeId)
      const row = node.parentNode
      const table = row.parentNode
      const rows = table.getChildNodes()
      const rowNumber = rows.indexOf(row)
      const rowAfter = table.getChildAt(rowNumber + 1)
      const nCols = row.getChildCount()
      let newRow = tx.createElement('tr')
      for (let j = 0; j < nCols; j++) {
        let cell = tx.createElement('td')
        newRow.append(cell)
      }
      table.insertBefore(newRow, rowAfter)
    })
  }
}
