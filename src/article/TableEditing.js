import { isString, documentHelpers } from 'substance'
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
      tx.selection = null
    }, { action: 'deleteRows', pos, count })
  }

  deleteCols(pos, count) {
    this.editorSession.transaction((tx) => {
      this._deleteCols(this._getTable(tx), pos, pos+count-1)
      tx.selection = null
    }, { action: 'deleteCols', pos, count })
  }

  setCell(row, col, val) {
    this.editorSession.transaction(tx => {
      let table = this._getTable(tx)
      let cell = table.getCell(row, col)
      if (cell) {
        cell.textContent = val
        let sel = this.createTableSelection({
          type: 'range',
          anchorRow: row,
          anchorCol: col,
          focusRow: row,
          focusCol: col
        })
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
      let sel = this.createTableSelection({
        type: 'range',
        anchorRow: startRow,
        anchorCol: startCol,
        focusRow: startRow+n-1,
        focusCol: startCol+m-1
      })
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

  createTableSelection(data) {
    let sel = createTableSelection(data)
    sel.data.nodeId = this.tableId
    sel.surfaceId = this.surfaceId
    return sel
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

  _getCreateElement(table) {
    const doc = table.getDocument()
    return doc.createElement.bind(doc)
  }

  _createRowsAt(table, rowIdx, n) {
    let $$ = this._getCreateElement(table)
    const M = table.getColumnCount()
    let rowAfter = table.getChildAt(rowIdx)
    for (let i = 0; i < n; i++) {
      let row = $$('table-row')
      for (let j = 0; j < M; j++) {
        let cell = $$('table-cell')
        row.append(cell)
      }
      table.insertBefore(row, rowAfter)
    }
  }

  _deleteRows(table, startRow, endRow) {
    for (let rowIdx = endRow; rowIdx >= startRow; rowIdx--) {
      let row = table.getChildAt(rowIdx)
      documentHelpers.deleteNode(table.getDocument(), row)
      table.removeChild(row)
    }
  }

  _deleteCols(table, startCol, endCol) {
    let N = table.getRowCount()
    for (let rowIdx = N-1; rowIdx >= 0; rowIdx--) {
      let row = table.getChildAt(rowIdx)
      for (let colIdx = endCol; colIdx >= startCol; colIdx--) {
        let cell = row.getChildAt(colIdx)
        row.removeAt(colIdx)
        documentHelpers.deleteNode(table.getDocument(), cell)
      }
    }
  }

  _createColumnsAt(table, colIdx, n) {
    let $$ = this._getCreateElement(table)
    let rowIt = table.getChildNodeIterator()
    while(rowIt.hasNext()) {
      let row = rowIt.next()
      let cellAfter = row.getChildAt(colIdx)
      for (let j = 0; j < n; j++) {
        let cell = $$('table-cell')
        row.insertBefore(cell, cellAfter)
      }
    }
  }

}

