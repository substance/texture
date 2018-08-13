import { isString, documentHelpers } from 'substance'
import {
  createTableSelection, getSelectionData, getSelectedRange,
  getCellRange
} from '../shared/tableHelpers'

export default class TableEditing {
  constructor (editorSession, tableId, surfaceId) {
    this.editorSession = editorSession
    this.tableId = tableId
    this.surfaceId = surfaceId
  }

  getTable () {
    return this.editorSession.getDocument().get(this.tableId)
  }

  getSelectionData () {
    return getSelectionData(this.editorSession.getSelection())
  }

  getSelectedRange () {
    return getSelectedRange(this.getTable(), this.getSelectionData())
  }

  insertRows (pos, count) {
    this.editorSession.transaction((tx) => {
      this._createRowsAt(this._getTable(tx), pos, count)
    }, { action: 'insertRows', pos, count })
  }

  insertCols (pos, count) {
    this.editorSession.transaction((tx) => {
      this._createColumnsAt(this._getTable(tx), pos, count)
    }, { action: 'insertCols', pos, count })
  }

  deleteRows (pos, count) {
    this.editorSession.transaction((tx) => {
      this._deleteRows(this._getTable(tx), pos, pos + count - 1)
      tx.selection = null
    }, { action: 'deleteRows', pos, count })
  }

  deleteCols (pos, count) {
    this.editorSession.transaction((tx) => {
      this._deleteCols(this._getTable(tx), pos, pos + count - 1)
      tx.selection = null
    }, { action: 'deleteCols', pos, count })
  }

  setCell (cellId, val) {
    this.editorSession.transaction(tx => {
      let table = this._getTable(tx)
      let cell = table.get(cellId)
      if (cell) {
        if (cell.shadowed) throw new Error('Can not change a shadowed cell')
        cell.textContent = val
        let sel = this.createTableSelection({
          type: 'range',
          anchorCellId: cell.id,
          focusCellId: cell.id
        })
        tx.setSelection(sel)
      }
    }, { action: 'setCell' })
  }

  editCell (cellId, newVal) {
    if (isString(newVal)) {
      this.editorSession.transaction(tx => {
        let cell = tx.get(cellId)
        let path = cell.getPath()
        cell.textContent = newVal
        tx.setSelection({
          type: 'property',
          path,
          startOffset: newVal.length,
          surfaceId: this.surfaceId + '/' + path.join('.')
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
        surfaceId: this.surfaceId + '/' + path.join('.')
      })
    }
  }

  setValues (anchorCellId, vals) {
    let n = vals.length
    let m = vals[0].length
    let table = this.getTable()
    let { startRow, startCol } = getCellRange(table, anchorCellId, anchorCellId)
    this.ensureSize(startRow + n, startCol + m)
    let lastCell = table.getCell(startRow + n - 1, startCol + m - 1)
    if (lastCell.shadowed) lastCell = lastCell.masterCell
    this.editorSession.transaction(tx => {
      let table = this._getTable(tx)
      this._setValues(table, startRow, startCol, vals)
      let sel = this.createTableSelection({
        type: 'range',
        anchorCellId,
        focusCellId: lastCell.id
      })
      tx.setSelection(sel)
    }, { action: 'setValues' })
  }

  clearValues (anchorCellId, focusCellId) {
    let table = this.getTable()
    let { startRow, endRow, startCol, endCol } = getCellRange(table, anchorCellId, focusCellId)
    this.editorSession.transaction(tx => {
      // Note: the selection remains the same
      this._clearValues(this._getTable(tx), startRow, startCol, endRow, endCol)
    })
  }

  ensureSize (nrows, ncols) {
    let table = this._getTable(this.editorSession.getDocument())
    let [_nrows, _ncols] = table.getDimensions()
    if (_ncols < ncols) {
      this.insertCols(_ncols, ncols - _ncols)
    }
    if (_nrows < nrows) {
      this.insertRows(_nrows, nrows - _nrows)
    }
  }

  insertSoftBreak () {
    this.editorSession.transaction(tx => {
      tx.insertText('\n')
    }, 'insertSoftBreak')
  }

  setHeading (cellIds, heading) {
    let doc = this.editorSession.getDocument()
    cellIds = cellIds.filter(id => {
      let cell = doc.get(id)
      let val = cell.getAttribute('heading')
      return Boolean(val) !== heading
    })
    if (cellIds.length === 0) return
    this.editorSession.transaction(tx => {
      cellIds.forEach(id => {
        let cell = tx.get(id)
        if (heading) {
          cell.setAttribute('heading', true)
        } else {
          cell.removeAttribute('heading')
        }
      })
    }, { action: 'setHeading' })
  }

  merge () {
    let table = this.getTable()
    let { startRow, endRow, startCol, endCol } = this.getSelectedRange()
    let bigOne = table.getCell(startRow, startCol)
    // compute the span by walking all non-shadowed cells
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        let cell = table.getCell(i, j)
        if (cell.shadowed) continue
        let rowspan = cell.rowspan
        let colspan = cell.colspan
        if (rowspan > 1) {
          endRow = Math.max(endRow, i + rowspan - 1)
        }
        if (colspan > 1) {
          endCol = Math.max(endCol, j + colspan - 1)
        }
      }
    }
    // Note: spans should be >= 1, i.e. rowspan=1 means no spanning
    let rowspan = endRow - startRow + 1
    let colspan = endCol - startCol + 1
    if (bigOne.rowspan !== rowspan || bigOne.colspan !== colspan) {
      this.editorSession.transaction(tx => {
        let cell = tx.get(bigOne.id)
        cell.setAttribute('rowspan', rowspan)
        cell.setAttribute('colspan', colspan)
      }, { action: 'mergeCells' })
    }
  }

  unmerge () {
    let table = this.getTable()
    let { startRow, endRow, startCol, endCol } = this.getSelectedRange()
    let cellIds = []
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        let cell = table.getCell(i, j)
        let rowspan = cell.rowspan
        let colspan = cell.colspan
        if (rowspan > 1 || colspan > 1) {
          cellIds.push(cell.id)
        }
      }
    }
    if (cellIds.length > 0) {
      this.editorSession.transaction(tx => {
        cellIds.forEach(id => {
          let cell = tx.get(id)
          cell.removeAttribute('rowspan')
          cell.removeAttribute('colspan')
        })
      }, { action: 'unmergeCells' })
    }
  }

  _getTable (tx) {
    return tx.get(this.tableId)
  }

  createTableSelection (data) {
    let sel = createTableSelection(data)
    sel.data.nodeId = this.tableId
    sel.surfaceId = this.surfaceId
    return sel
  }

  selectAll () {
    let table = this.getTable()
    let [N, M] = table.getDimensions()
    if (N === 0 || M === 0) return
    let anchorCell = table.getCell(0, 0)
    let focusCell = table.getCell(N - 1, M - 1)
    if (focusCell.shadowed) {
      focusCell = focusCell.masterCell
    }
    this.editorSession.setSelection(this.createTableSelection({
      type: 'range',
      anchorCellId: anchorCell.id,
      focusCellId: focusCell.id
    }))
  }

  _setValues (table, startRow, startCol, vals) {
    for (let i = 0; i < vals.length; i++) {
      let row = vals[i]
      for (let j = 0; j < row.length; j++) {
        let val = row[j]
        let cell = table.getCell(startRow + i, startCol + j)
        cell.textContent = val
        // HACK: for now we remove merge
        cell.removeAttribute('rowspan')
        cell.removeAttribute('colspan')
      }
    }
  }

  _clearValues (table, startRow, startCol, endRow, endCol) {
    for (let rowIdx = startRow; rowIdx <= endRow; rowIdx++) {
      for (let colIdx = startCol; colIdx <= endCol; colIdx++) {
        let cell = table.getCell(rowIdx, colIdx)
        cell.textContent = ''
      }
    }
  }

  _setCellTypesForRange (table, startRow, startCol, endRow, endCol, type) {
    for (let rowIdx = startRow; rowIdx <= endRow; rowIdx++) {
      for (let colIdx = startCol; colIdx <= endCol; colIdx++) {
        let cell = table.getCell(rowIdx, colIdx)
        cell.attr({type: type})
      }
    }
  }

  _getCreateElement (table) {
    const doc = table.getDocument()
    return doc.createElement.bind(doc)
  }

  _createRowsAt (table, rowIdx, n) {
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

  _deleteRows (table, startRow, endRow) {
    for (let rowIdx = endRow; rowIdx >= startRow; rowIdx--) {
      let row = table.getChildAt(rowIdx)
      table.removeChild(row)
      documentHelpers.deleteNode(table.getDocument(), row)
    }
  }

  _deleteCols (table, startCol, endCol) {
    let N = table.getRowCount()
    for (let rowIdx = N - 1; rowIdx >= 0; rowIdx--) {
      let row = table.getChildAt(rowIdx)
      for (let colIdx = endCol; colIdx >= startCol; colIdx--) {
        let cell = row.getChildAt(colIdx)
        row.removeAt(colIdx)
        documentHelpers.deleteNode(table.getDocument(), cell)
      }
    }
  }

  _createColumnsAt (table, colIdx, n) {
    let $$ = this._getCreateElement(table)
    let rowIt = table.getChildNodeIterator()
    while (rowIt.hasNext()) {
      let row = rowIt.next()
      let cellAfter = row.getChildAt(colIdx)
      for (let j = 0; j < n; j++) {
        let cell = $$('table-cell')
        row.insertBefore(cell, cellAfter)
      }
    }
  }
}
