import TableCellCommand from './TableCellCommand'

export default class InsertColumnCommand extends TableCellCommand {
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
      const tableHeadAfter = tableHeadRow.getChildAt(colNumber + 1)
      let newTableHead = tx.createElement('th')
      newTableHead.textContent = 'New column'
      tableHeadRow.insertBefore(newTableHead, tableHeadAfter)
      let it = tableBody.getChildNodeIterator()
      while(it.hasNext()) {
        let nextRow = it.next()
        let cellAfter = nextRow.getChildAt(colNumber + 1)
        let newCell = tx.createElement('td')
        nextRow.insertBefore(newCell, cellAfter)
      }
    })
  }
}
