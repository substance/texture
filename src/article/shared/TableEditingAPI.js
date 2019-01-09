import { documentHelpers } from 'substance'
import { getCellRange, getRangeFromMatrix } from '../shared/tableHelpers'

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
    let cells = getRangeFromMatrix(table.getCellMatrix(), startRow, startCol, endRow, endCol, true)
    let snippet = doc.createSnippet()
    let tableCopy = snippet.create({ type: 'table' })
    // TODO: consolidate inconsistent Node API (Container vs XMLElementNode)
    for (let row of cells) {
      let trow = snippet.create({ type: 'table-row' })
      for (let cell of row) {
        let _nodes = documentHelpers.copyNode(cell).map(_node => snippet.create(_node))
        trow.appendChild(_nodes[0])
      }
      tableCopy.appendChild(trow)
    }
    snippet.getContainer().append(tableCopy.id)
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
          if (copyCell.getAttribute('heading')) {
            cell.setAttribute('heading', true)
          } else {
            cell.removeAttribute('heading')
          }
          // TODO: limit rowspan so that it does not exceed overall dims
          cell.setAttribute('rowspan', copyCell.rowspan)
          cell.setAttribute('colspan', copyCell.colspan)
          // TODO: copy annotations too
          cell.textContent = copyCell.textContent
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

  _getCreateElement (table) {
    const doc = table.getDocument()
    return doc.createElement.bind(doc)
  }

  _createRowsAt (table, rowIdx, n) {
    let $$ = this._getCreateElement(table)
    const M = table.getColumnCount()
    let rowAfter = table.getRowAt(rowIdx)
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
      let row = table.getRowAt(rowIdx)
      table.removeChild(row)
      documentHelpers.deepDeleteNode(table.getDocument(), row)
    }
  }

  _deleteCols (table, startCol, endCol) {
    let N = table.getRowCount()
    for (let rowIdx = N - 1; rowIdx >= 0; rowIdx--) {
      let row = table.getRowAt(rowIdx)
      for (let colIdx = endCol; colIdx >= startCol; colIdx--) {
        let cell = row.getCellAt(colIdx)
        row.removeAt(colIdx)
        documentHelpers.deepDeleteNode(table.getDocument(), cell)
      }
    }
  }

  _createColumnsAt (table, colIdx, n) {
    let $$ = this._getCreateElement(table)
    let rowIt = table.getChildNodeIterator()
    while (rowIt.hasNext()) {
      let row = rowIt.next()
      let cellAfter = row.getCellAt(colIdx)
      for (let j = 0; j < n; j++) {
        let cell = $$('table-cell')
        row.insertBefore(cell, cellAfter)
      }
    }
  }

  _clearValues (table, startRow, startCol, endRow, endCol) {
    for (let rowIdx = startRow; rowIdx <= endRow; rowIdx++) {
      for (let colIdx = startCol; colIdx <= endCol; colIdx++) {
        let cell = table.getCell(rowIdx, colIdx)
        // TODO: are we sure that annotations get deleted this way?
        // Note that there is a delete logic behind this setText()
        cell.setText('')
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
