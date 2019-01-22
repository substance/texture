import { DocumentNode, CHILDREN, documentHelpers } from 'substance'

export default class Table extends DocumentNode {
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
      let rows = this.getRows()
      let matrix = rows.map((row, rowIdx) => {
        let cells = row.getCells()
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
    return this.rows.length
  }

  getColumnCount () {
    if (this.rows.length === 0) return 0
    let doc = this.getDocument()
    let firstRow = doc.get(this.rows[0])
    return firstRow.cells.length
  }

  getDimensions () {
    return [this.getRowCount(), this.getColumnCount()]
  }

  getRowAt (rowIdx) {
    let doc = this.getDocument()
    return doc.get(this.rows[rowIdx])
  }

  getCell (rowIdx, colIdx) {
    const matrix = this.getCellMatrix()
    let row = matrix[rowIdx]
    if (row) {
      return row[colIdx]
    }
  }

  getRows () {
    return documentHelpers.getNodesForIds(this.getDocument(), this.rows)
  }

  _enableCaching () {
    // this hook is used to invalidate cached positions
    if (this.document) {
      this._rowIds = new Set(this.rows)
      let cellIds = this.getRows().reduce((arr, row) => {
        return arr.concat(row.cells)
      }, [])
      this._cellIds = new Set(cellIds)
      this.document.data.on('operation:applied', this._onOperationApplied, this)
    }
  }

  _onOperationApplied (op) {
    if (!op.path) return
    let nodeId = op.path[0]
    let hasChanged = false
    // whenever a row is added or removed
    if (nodeId === this.id && op.path[1] === 'rows') {
      let update = op.getValueOp()
      if (update.isDelete()) {
        this._rowIds.delete(update.getValue())
      } else if (update.isInsert()) {
        let rowId = update.getValue()
        let row = this.document.get(rowId)
        row.cells.forEach(cellId => {
          this._cellIds.add(cellId)
        })
        this._rowIds.add(rowId)
      }
      hasChanged = true
    // whenever a row is changed belonging to this table
    } else if (this._rowIds.has(nodeId) && op.path[1] === 'cells') {
      let update = op.getValueOp()
      if (update.isDelete()) {
        this._cellIds.delete(update.getValue())
      } else if (update.isInsert()) {
        this._cellIds.add(update.getValue())
      }
      hasChanged = true
    // whenever rowspan/colspan of cell is changed, that belongs to this table
    } else if (this._cellIds.has(nodeId) && (op.path[1] === 'rowspan' || op.path[1] === 'colspan')) {
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

  static getTemplate (options = {}) {
    let headerRowCount = options.headerRows || 1
    let rowCount = options.rows || 3
    let colCount = options.cols || 4

    return {
      type: 'table',
      id: options.id,
      rows: Table.getRowsTemplate(headerRowCount, colCount, true)
        .concat(Table.getRowsTemplate(rowCount, colCount))
    }
  }

  static getRowsTemplate (rowCount, colCount, heading) {
    return Array(rowCount).fill().map(_ => {
      return {
        type: 'table-row',
        cells: Table.getCellsTemplate(colCount, heading)
      }
    })
  }

  static getCellsTemplate (colCount, heading) {
    return Array(colCount).fill().map(_ => {
      return {
        type: 'table-cell',
        heading
      }
    })
  }
}

Table.schema = {
  type: 'table',
  rows: CHILDREN('table-row')
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
