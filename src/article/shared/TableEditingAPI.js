import { documentHelpers } from 'substance'
import { getCellRange, getRangeFromMatrix } from '../shared/tableHelpers'
import { Table } from '../models'

export default class TableEditingAPI {
  constructor (editorSession) {
    this.editorSession = editorSession
  }

  isTableSelected () {
    let sel = this._getSelection()
    return (sel && !sel.isNull() && sel.customType === 'table')
  }

  deleteSelection () {
    if (!this.isTableSelected()) throw new Error('Table selection required')
    let selData = this._getSelectionData()
    let { tableId, startRow, endRow, startCol, endCol } = selData
    this.editorSession.transaction(tx => {
      // Note: the selection remains the same
      this._clearValues(tx.get(tableId), startRow, startCol, endRow, endCol)
    }, { action: 'deleteSelection' })
  }

  copySelection () {
    if (!this.isTableSelected()) throw new Error('Table selection required')

    // create a snippet with a table containing only the selected range
    let selData = this._getSelectionData()
    let { table, startRow, endRow, startCol, endCol } = selData
    let doc = this._getDocument()
    let matrix = getRangeFromMatrix(table.getCellMatrix(), startRow, startCol, endRow, endCol, true)
    let snippet = doc.createSnippet()
    let tableData = { type: 'table', rows: [] }
    for (let row of matrix) {
      let rowData = { type: 'table-row', cells: [] }
      for (let cell of row) {
        let ids = documentHelpers.copyNode(cell).map(_node => snippet.create(_node).id)
        let cellId = ids[0]
        console.assert(cellId, 'cellId should not be nil')
        rowData.cells.push(ids[0])
      }
      tableData.rows.push(snippet.create(rowData).id)
    }
    let tableCopy = snippet.create(tableData)
    snippet.getContainer().append(tableCopy.id)
    return snippet
  }

  cut () {
    let snippet = this.copySelection()
    this.deleteSelection()
    return snippet
  }

  paste (content, options) {
    if (!this.isTableSelected()) throw new Error('Table selection required')

    // TODO: implement paste for tables
    let snippet = content.get(documentHelpers.SNIPPET_ID)
    if (!snippet) return false
    let first = snippet.getNodeAt(0)
    if (first.type !== 'table') return false
    return this._pasteTable(first)
  }

  _pasteTable (copy) {
    // TODO: extend dimension if necessary
    // and the assign cell attributes and content
    // ATTENTION: make sure that col/rowspans do not extend the table dims
    let [nrows, ncols] = copy.getDimensions()
    let selData = this._getSelectionData()
    let { tableId, startRow, startCol } = selData
    let N = startRow + nrows
    let M = startCol + ncols
    // make the table larger if necessary
    this._ensureSize(tableId, N, M)

    this.editorSession.transaction(tx => {
      let table = tx.get(tableId)
      let cellMatrix = table.getCellMatrix()
      let copyCellMatrix = copy.getCellMatrix()
      for (let rowIdx = 0; rowIdx < nrows; rowIdx++) {
        for (let colIdx = 0; colIdx < ncols; colIdx++) {
          let copyCell = copyCellMatrix[rowIdx][colIdx]
          let cell = cellMatrix[startRow + rowIdx][startCol + colIdx]
          // TODO: copy annotations too
          cell.assign(copyCell.toJSON())
        }
      }
    }, { action: 'paste' })

    return true
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
          tx.set([cell.id, 'rowspan', 1])
          tx.set([cell.id, 'colspan', 1])
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
      cell.setText(newVal)
      tx.setSelection({
        type: 'property',
        path,
        startOffset: newVal.length,
        surfaceId: selData.surfaceId + '/' + path.join('.')
      })
    }, { action: 'insertText' })
  }

  insertSoftBreak () {
    this.editorSession.transaction(tx => {
      tx.insertText('\n')
    }, { action: 'soft-break' })
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
      let nodeId = sel.nodeId
      let { anchorCellId, focusCellId } = sel.data
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
    let doc = table.getDocument()
    let M = table.getColumnCount()
    const path = [table.id, 'rows']
    let rowIds = Table.getRowsTemplate(n, M).map(data => documentHelpers.createNodeFromJson(doc, data).id)
    for (let i = 0; i < n; i++) {
      documentHelpers.insertAt(doc, path, rowIdx + i, rowIds[i])
    }
  }

  _deleteRows (table, startRow, endRow) {
    let doc = table.getDocument()
    const path = [table.id, 'rows']
    for (let rowIdx = endRow; rowIdx >= startRow; rowIdx--) {
      let id = documentHelpers.removeAt(doc, path, rowIdx)
      documentHelpers.deepDeleteNode(table.getDocument(), id)
    }
  }

  _deleteCols (table, startCol, endCol) {
    let doc = table.getDocument()
    let N = table.getRowCount()
    for (let rowIdx = N - 1; rowIdx >= 0; rowIdx--) {
      let row = table.getRowAt(rowIdx)
      let path = [row.id, 'cells']
      for (let colIdx = endCol; colIdx >= startCol; colIdx--) {
        let id = documentHelpers.removeAt(doc, path, colIdx)
        documentHelpers.deepDeleteNode(table.getDocument(), id)
      }
    }
  }

  _createColumnsAt (table, colIdx, n) {
    let doc = table.getDocument()
    let rows = table.resolve('rows')
    for (let row of rows) {
      let path = [row.id, 'cells']
      let cellIds = Table.getCellsTemplate(n).map(data => documentHelpers.createNodeFromJson(doc, data).id)
      for (let i = 0; i < n; i++) {
        documentHelpers.insertAt(doc, path, colIdx + i, cellIds[i])
      }
    }
  }

  _clearValues (table, startRow, startCol, endRow, endCol) {
    let doc = table.getDocument()
    for (let rowIdx = startRow; rowIdx <= endRow; rowIdx++) {
      for (let colIdx = startCol; colIdx <= endCol; colIdx++) {
        let cell = table.getCell(rowIdx, colIdx)
        documentHelpers.deleteTextRange(doc, { path: cell.getPath(), offset: 0 })
      }
    }
  }

  _ensureSize (tableId, nrows, ncols) {
    let table = this._getDocument().get(tableId)
    let [_nrows, _ncols] = table.getDimensions()
    if (_ncols < ncols) {
      let pos = _ncols
      let count = ncols - _ncols
      this.editorSession.transaction(tx => {
        this._createColumnsAt(tx.get(tableId), pos, count)
      }, { action: 'insertCols', pos, count })
    }
    if (_nrows < nrows) {
      let pos = _nrows
      let count = nrows - _nrows
      this.editorSession.transaction(tx => {
        this._createRowsAt(tx.get(tableId), pos, count)
      }, { action: 'insertRows', pos, count })
    }
  }
}
