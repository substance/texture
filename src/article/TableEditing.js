import { isString } from 'substance'
import { createTableSelection, getSelectionData, getSelectedRange } from './tableHelpers'

export default class TableEditing {

  constructor(editorSession, tableId, surfaceId) {
    this.editorSession = editorSession
    this.tableId = tableId
    this.surfaceId = surfaceId
  }

  getTable() {
    return this.editorSession.getDocument().get(this.tableId)
  }

  getSelectionData() {
    return getSelectionData(this.editorSession.getSelection())
  }

  getSelectedRange() {
    return getSelectedRange(this.getTable(), this.getSelectionData())
  }

  insertRows(pos, count) {
    this.editorSession.transaction((tx) => {
      this._createRowsAt(this._getTable(tx), pos, count)
    }, { action: 'insertRows', pos, count })
  }

  insertCols(pos, count) {
    this.editorSession.transaction((tx) => {
      this._createColumnsAt(this._getTable(tx), pos, count)
    }, { action: 'insertCols', pos, count })
  }

  deleteRows(pos, count) {
    this.editorSession.transaction((tx) => {
      this._deleteRows(this._getTable(tx), pos, pos+count-1)
    }, { action: 'deleteRows', pos, count })
  }

  deleteCols(pos, count) {
    this.editorSession.transaction((tx) => {
      this._deleteCols(this._getTable(tx), pos, pos+count-1)
    }, { action: 'deleteCols', pos, count })
  }

  setCell(row, col, val) {
    this.editorSession.transaction(tx => {
      let table = this._getTable(tx)
      let cell = table.getCell(row, col)
      if (cell) {
        cell.textContent = val
        let sel = this._createTableSelection({
          type: 'range',
          anchorRow: row,
          anchorCol: col,
          focusRow: row,
          focusCol: col
        })
        sel.surfaceId = this.surfaceId
        tx.setSelection(sel)
      }
    }, { action: 'setCell' })
  }

  editCell(cellId, newVal) {
    if (isString(newVal)) {
      this.editorSession.transaction(tx => {
        let cell = tx.get(cellId)
        let path = cell.getPath()
        cell.textContent = newVal
        tx.setSelection({
          type: 'property',
          path,
          startOffset: newVal.length,
          surfaceId: this.surfaceId+'/'+path.join('.')
        })
      })
    } else {
      let doc = this.editorSession.getDocument()
      let cell = doc.get(cellId)
      let path = cell.getPath()
      this.editorSession.setSelection({
        type: 'property',
        path,
        startOffset: cell.getLength(),
        surfaceId: this.surfaceId+'/'+path.join('.')
      })
    }
  }

  setValues(startRow, startCol, vals) {
    let n = vals.length
    let m = vals[0].length
    this.ensureSize(startRow+n, startCol+m)
    this.editorSession.transaction(tx => {
      let table = this._getTable(tx)
      this._setValues(table, startRow, startCol, vals)
      let sel = this._createTableSelection({
        type: 'range',
        anchorRow: startRow,
        anchorCol: startCol,
        focusRow: startRow+n-1,
        focusCol: startCol+m-1
      })
      sel.surfaceId = this.surfaceId
      tx.setSelection(sel)
    }, { action: 'setValues' })
  }

  clearValues(startRow, startCol, endRow, endCol) {
    this.editorSession.transaction(tx => {
      // Note: the selection remains the same
      this._clearValues(this._getTable(tx), startRow, startCol, endRow, endCol)
    })
  }

  ensureSize(nrows, ncols) {
    let table = this._getTable(this.editorSession.getDocument())
    let [_nrows, _ncols] = table.getDimensions()
    if (_ncols < ncols) {
      this.insertCols(_ncols, ncols-_ncols)
    }
    if (_nrows < nrows) {
      this.insertRows(_nrows, nrows-_nrows)
    }
  }

  insertSoftBreak() {
    this.editorSession.transaction(tx => {
      tx.insertText('\n')
    }, 'insertSoftBreak')
  }

  _getTable(tx) {
    return tx.get(this.tableId)
  }

  _createTableSelection(data) {
    return createTableSelection(data)
  }

  _setValues(table, startRow, startCol, vals) {
    for (let i = 0; i < vals.length; i++) {
      let row = vals[i]
      for (let j = 0; j < row.length; j++) {
        let val = row[j]
        let cell = table.getCell(startRow+i, startCol+j)
        if (cell) {
          cell.textContent = val
        }
      }
    }
  }

  _clearValues(table, startRow, startCol, endRow, endCol) {
    for (let rowIdx = startRow; rowIdx <= endRow; rowIdx++) {
      for (let colIdx = startCol; colIdx <= endCol; colIdx++) {
        let cell = table.getCell(rowIdx, colIdx)
        cell.textContent = ''
      }
    }
  }

  _setCellTypesForRange(table, startRow, startCol, endRow, endCol, type) {
    for (let rowIdx = startRow; rowIdx <= endRow; rowIdx++) {
      for (let colIdx = startCol; colIdx <= endCol; colIdx++) {
        let cell = table.getCell(rowIdx, colIdx)
        cell.attr({type: type})
      }
    }
  }

  _createRowsAt(table, rowIdx, n) {
    let $$ = table.createElement.bind(table)
    const M = table.getColumnCount()
    let data = table._getData()
    let rowAfter = data.getChildAt(rowIdx)
    for (let i = 0; i < n; i++) {
      let row = $$('row')
      for (let j = 0; j < M; j++) {
        let cell = $$('cell')
        // TODO: maybe insert default value?
        row.append(cell)
      }
      data.insertBefore(row, rowAfter)
    }
  }

  _deleteRows(table, startRow, endRow) {
    let data = table._getData()
    for (let rowIdx = endRow; rowIdx >= startRow; rowIdx--) {
      let row = data.getChildAt(rowIdx)
      // TODO: add a helper to delete recursively
      row._childNodes.forEach((id) => {
        table.delete(id)
      })
      data.removeChild(row)
    }
  }

  _deleteCols(table, startCol, endCol) {
    let data = table._getData()
    let N = table.getRowCount()
    let columns = table._getColumns()
    for (let colIdx = endCol; colIdx >= startCol; colIdx--) {
      columns.removeAt(colIdx)
    }
    for (let rowIdx = N-1; rowIdx >= 0; rowIdx--) {
      let row = data.getChildAt(rowIdx)
      for (let colIdx = endCol; colIdx >= startCol; colIdx--) {
        const cellId = row.getChildAt(colIdx).id
        row.removeAt(colIdx)
        table.delete(cellId)
      }
    }
  }

  _createColumnsAt(table, colIdx, n) {
    // TODO: we need to add columns' meta, too
    // for each existing row insert new cells
    let $$ = table.createElement.bind(table)
    let data = table._getData()
    let it = data.getChildNodeIterator()
    let columns = table._getColumns()
    let colAfter = columns.getChildAt(colIdx)
    for (let j = 0; j < n; j++) {
      let col = $$('col').attr('type', 'any')
      columns.insertBefore(col, colAfter)
    }
    while(it.hasNext()) {
      let row = it.next()
      let cellAfter = row.getChildAt(colIdx)
      for (let j = 0; j < n; j++) {
        let cell = $$('cell')
        row.insertBefore(cell, cellAfter)
      }
    }
  }

}

