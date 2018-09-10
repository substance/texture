import { documentHelpers } from 'substance'
import { getCellRange } from '../shared/tableHelpers'

export default class TableEditingAPI {
  constructor (editorSession) {
    this.editorSession = editorSession
  }

  isTableSelected () {
    let sel = this._getSelection()
    return (sel && !sel.isNull() && sel.customType === 'table')
  }

  copySelection (doc, selection) {
    // TODO: implement copySelection for tables
    debugger
  }

  paste (options) {
    // TODO: implement paste for tables
    debugger
  }

  insertRows (mode, count) {
    if (!this.isTableSelected()) return

    let selData = this._getSelectionData()
    let tableId = selData.tableId
    let pos = mode === 'below' ? selData.endRow + 1 : selData.startRow
    this.editorSession.transaction(tx => {
      this._createRowsAt(tx.get(tableId), pos, count)
    }, { action: 'insertRows', pos, count })
  }

  insertCols (mode, count) {
    if (!this.isTableSelected()) return
    let selData = this._getSelectionData()
    let tableId = selData.tableId
    let pos = mode === 'right' ? selData.endCol + 1 : selData.startCol
    this.editorSession.transaction(tx => {
      this._createColumnsAt(tx.get(tableId), pos, count)
    }, { action: 'insertCols', pos, count })
  }

  deleteRows () {
    if (!this.isTableSelected()) return
    let selData = this._getSelectionData()
    let tableId = selData.tableId
    let pos = selData.startRow
    let count = selData.nrows
    this.editorSession.transaction(tx => {
      this._deleteRows(tx.get(tableId), pos, count)
      tx.selection = null
    }, { action: 'deleteRows', pos, count })
  }

  deleteCols () {
    if (!this.isTableSelected()) return
    let selData = this._getSelectionData()
    let tableId = selData.tableId
    let pos = selData.startCol
    let count = selData.ncols
    this.editorSession.transaction(tx => {
      this._deleteCols(tx.get(tableId), pos, pos + count - 1)
      tx.selection = null
    }, { action: 'deleteCols', pos, count })
  }

  merge () {
    if (!this.isTableSelected()) return
    let selData = this._getSelectionData()
    // TODO: make sure that the selection allows to do that
    const tableId = selData.tableId
    let table = this._getDocument().get(tableId)
    let { startRow, endRow, startCol, endCol } = selData
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
    if (!this.isTableSelected()) return
    let selData = this._getSelectionData()
    // TODO: make sure that the selection allows to do that
    const tableId = selData.tableId
    let table = this._getDocument().get(tableId)
    let { startRow, endRow, startCol, endCol } = selData
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

  toggleHeading (cellIds) {
    if (cellIds && cellIds.length > 0) {
      this.editorSession.transaction(tx => {
        for (let id of cellIds) {
          let cell = tx.get(id)
          let heading = cell.getAttribute('heading')
          if (heading) cell.removeAttribute('heading')
          else cell.setAttribute('heading', true)
        }
      }, { action: 'toggleHeading' })
    }
  }

  insertText (newVal) {
    if (!this.isTableSelected()) return
    let selData = this._getSelectionData()
    let cellId = selData.anchorCell.id
    this.editorSession.transaction(tx => {
      let cell = tx.get(cellId)
      let path = cell.getPath()
      cell.textContent = newVal
      tx.setSelection({
        type: 'property',
        path,
        startOffset: newVal.length,
        surfaceId: selData.surfaceId + '/' + path.join('.')
      })
    }, { action: 'insertText' })
  }

  _getDocument () {
    return this.editorSession.getDocument()
  }

  _getSelection () {
    return this.editorSession.getSelection()
  }

  _getSelectionData () {
    let doc = this._getDocument()
    let sel = this._getSelection()
    if (sel && sel.customType === 'table') {
      let { nodeId, anchorCellId, focusCellId } = sel.data
      let table = doc.get(nodeId)
      let anchorCell = doc.get(anchorCellId)
      let focusCell = doc.get(focusCellId)
      let { startRow, startCol, endRow, endCol } = getCellRange(table, anchorCellId, focusCellId)
      return {
        table,
        tableId: table.id,
        anchorCell,
        focusCell,
        startRow,
        endRow,
        startCol,
        endCol,
        nrows: endRow - startRow + 1,
        ncols: endCol - startCol + 1,
        surfaceId: sel.surfaceId
      }
    }
  }

  _getTable (doc, sel) {
    if (!sel || sel.isNull() || sel.customType === 'table') {
      return null
    }
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
