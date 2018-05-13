import { XMLElementNode } from 'substance'

export default class TableElementNode extends XMLElementNode {

  constructor(...args) {
    super(...args)

    this._rowIds = new Set(...this._childNodes)
    this._matrix = null
    this._enableCaching()
  }

  getCellMatrix() {
    if (!this._matrix) {
      this._matrix = this.getChildren().map((row, rowIdx) => {
        let cells = row.getChildren()
        for (let colIdx = 0; colIdx < cells.length; colIdx++) {
          let c = cells[colIdx]
          c.rowIdx = rowIdx
          c.colIdx = colIdx
        }
        return cells
      })
    }
    return this._matrix
  }

  getRowCount() {
    return this.getChildCount()
  }

  getColumnCount() {
    if (this._childNodes.length === 0) return 0
    let firstRow = this.getChildAt(0)
    return firstRow.getChildCount()
  }

  getDimensions() {
    return [this.getRowCount(), this.getColumnCount()]
  }

  getCell(rowIdx, colIdx) {
    const matrix = this.getCellMatrix()
    let row = matrix[rowIdx]
    if (row) {
      return row[colIdx]
    }
  }

  _enableCaching() {
    // this hook is used to invalidate cached positions
    if (this.document) {
      this.document.data.on('operation:applied', this._onOperationApplied, this)
    }
  }

  _onOperationApplied(op) {
    if (!op.path) return
    let nodeId = op.path[0]
    if (nodeId === this.id && op.path[1] === '_childNodes') {
      if (op.isDelete()) {
        this._rowIds.delete(op.getValue())
      } else if (op.isInsert()) {
        this._rowIds.add(op.getValue())
      }
      this._matrix = null
    } else if (this._rowIds.has(nodeId) && op.path[1] === '_childNodes') {
      this._matrix = null
    }
  }

}

TableElementNode.type = 'table'