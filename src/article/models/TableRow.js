import { DocumentNode, CHILDREN, documentHelpers } from 'substance'

export default class TableRow extends DocumentNode {
  getCells () {
    return documentHelpers.getNodesForIds(this.getDocument(), this.cells)
  }

  getCellAt (cellIdx) {
    let doc = this.getDocument()
    return doc.get(this.cells[cellIdx])
  }
}
TableRow.schema = {
  type: 'table-row',
  cells: CHILDREN('table-cell')
}
