import { XMLElementNode } from 'substance'
import { CHILDREN } from '../kit';

export default class TableNode extends XMLElementNode {
  constructor (...args) {
    super(...args)

    this._matrix = null
    this._rowIds = new Set()
    this._cellIds = new Set()
    this._sha = Math.random()

    this._enableCaching()
  }

  get (cellId) {
    if (!this._cellIds.has(cellId)) throw new Error('Cell is not part of this table.')
    return this.document.get(cellId)
  }

  getCellMatrix () {
    if (!this._matrix) {
      let spanningCells = []
      let matrix = this.getChildren().map((row, rowIdx) => {
        let cells = row.getChildren()
        for (let colIdx = 0; colIdx < cells.length; colIdx++) {
          let c = cells[colIdx]
          c.rowIdx = rowIdx
          c.colIdx = colIdx
          c.shadowed = false
          if (c.colspan || c.rowspan) {
            spanningCells.push(c)
          }
        }
        return cells
      })
      spanningCells.forEach(c => {
        _shadowSpanned(matrix, c.rowIdx, c.colIdx, c.rowspan, c.colspan, c)
      })
      this._matrix = matrix
    }
    return this._matrix
  }

  getRowCount () {
    return this.getChildCount()
  }

  getColumnCount () {
    if (this._childNodes.length === 0) return 0
    let firstRow = this.getChildAt(0)
    return firstRow.getChildCount()
  }

  getDimensions () {
    return [this.getRowCount(), this.getColumnCount()]
  }

  getCell (rowIdx, colIdx) {
    const matrix = this.getCellMatrix()
    let row = matrix[rowIdx]
    if (row) {
      return row[colIdx]
    }
  }

  _enableCaching () {
    // this hook is used to invalidate cached positions
    if (this.document) {
      this._rowIds = new Set(this._childNodes)
      let cellIds = this.getChildren().reduce((arr, row) => {
        return arr.concat(row._childNodes)
      }, [])
      this._cellIds = new Set(cellIds)
      this.document.data.on('operation:applied', this._onOperationApplied, this)
    }
  }

  _onOperationApplied (op) {
    if (!op.path) return
    let nodeId = op.path[0]
    let hasChanged = false
    if (nodeId === this.id && op.path[1] === '_childNodes') {
      let update = op.getValueOp()
      if (update.isDelete()) {
        this._rowIds.delete(update.getValue())
      } else if (update.isInsert()) {
        let rowId = update.getValue()
        let row = this.document.get(rowId)
        row._childNodes.forEach(cellId => {
          this._cellIds.add(cellId)
        })
        this._rowIds.add(rowId)
      }
      hasChanged = true
    } else if (this._rowIds.has(nodeId) && op.path[1] === '_childNodes') {
      let update = op.getValueOp()
      if (update.isDelete()) {
        this._cellIds.delete(update.getValue())
      } else if (update.isInsert()) {
        this._cellIds.add(update.getValue())
      }
      hasChanged = true
    } else if (this._cellIds.has(nodeId) && (op.path[2] === 'rowspan' || op.path[2] === 'colspan')) {
      hasChanged = true
    }
    if (hasChanged) {
      this._matrix = null
      // HACK: using a quasi-sha to indicate that this table has been
      // changed structurally
      this._sha = Math.random()
    }
  }

  _hasShaChanged (sha) {
    return (this._sha !== sha)
  }

  _getSha () {
    return this._sha
  }
}

TableNode.schema = {
  type: 'table',
  _childNodes: CHILDREN('table-row')
}

function _shadowSpanned (matrix, row, col, rowspan, colspan, masterCell) {
  if (!rowspan && !colspan) return
  for (let i = row; i <= row + rowspan - 1; i++) {
    for (let j = col; j <= col + colspan - 1; j++) {
      if (i === row && j === col) continue
      let cell = matrix[i][j]
      cell.shadowed = true
      cell.masterCell = masterCell
    }
  }
}
