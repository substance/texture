import { DocumentNode, CHILDREN } from 'substance'

export default class TableRow extends DocumentNode {
  getCells () {
    return this.resolve('cells')
  }
}
TableRow.schema = {
  type: 'table-row',
  cells: CHILDREN('table-cell')
}
