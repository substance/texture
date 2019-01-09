import { tableHelpers, documentHelpers } from 'substance'
import Table from '../models/Table'

export function createTableSelection (tableId, data, surfaceId) {
  if (!data.anchorCellId || !data.focusCellId) throw new Error('Invalid selection data')
  return {
    type: 'custom',
    customType: 'table',
    nodeId: tableId,
    data: data,
    surfaceId
  }
}

export function getSelectionData (sel) {
  if (sel && sel.customType === 'table') {
    return sel.data
  }
  return {}
}

export function getSelectedRange (table, selData) {
  return getCellRange(table, selData.anchorCellId, selData.focusCellId)
}

export function computeSelectionRectangle (ulRect, lrRect) {
  let selRect = {}
  selRect.top = ulRect.top
  selRect.left = ulRect.left
  selRect.width = lrRect.left + lrRect.width - selRect.left
  selRect.height = lrRect.top + lrRect.height - selRect.top
  return selRect
}

export function getCellRange (table, anchorCellId, focusCellId) {
  let anchorCell = table.get(anchorCellId)
  let focusCell = table.get(focusCellId)
  let startRow = Math.min(anchorCell.rowIdx, focusCell.rowIdx)
  let startCol = Math.min(anchorCell.colIdx, focusCell.colIdx)
  let endRow = Math.max(anchorCell.rowIdx + anchorCell.rowspan - 1, focusCell.rowIdx + focusCell.rowspan - 1)
  let endCol = Math.max(anchorCell.colIdx + anchorCell.colspan - 1, focusCell.colIdx + focusCell.colspan - 1)
  return { startRow, startCol, endRow, endCol }
}

export function computeUpdatedSelection (table, selData, dr, dc, expand) {
  let focusCellId = selData.focusCellId
  let focusCell = table.get(focusCellId)
  let rowIdx = focusCell.rowIdx
  let colIdx = focusCell.colIdx
  let rowspan = focusCell.rowspan
  let colspan = focusCell.colspan
  let newFocusCell
  if (dr) {
    if (dr < 0) {
      newFocusCell = table.getCell(rowIdx + dr, colIdx)
    } else if (dr > 0) {
      newFocusCell = table.getCell(rowIdx + rowspan - 1 + dr, colIdx)
    }
  } else if (dc) {
    if (dc < 0) {
      newFocusCell = table.getCell(rowIdx, colIdx + dc)
    } else if (dc > 0) {
      newFocusCell = table.getCell(rowIdx, colIdx + colspan - 1 + dc)
    }
  }
  if (newFocusCell) {
    if (newFocusCell.shadowed) newFocusCell = newFocusCell.masterCell
    let newFocusCellId = newFocusCell.id
    let newAnchorCellId = selData.anchorCellId
    if (!expand) {
      newAnchorCellId = newFocusCellId
    }
    return {
      anchorCellId: newAnchorCellId,
      focusCellId: newFocusCellId
    }
  } else {
    return selData
  }
}

export function generateTable (doc, nrows, ncols, tableId) {
  return documentHelpers.createNodeFromJson(doc, Table.getTemplate({
    id: tableId,
    headerRows: 1,
    rows: nrows,
    cols: ncols
  }))
}

const { getRangeFromMatrix } = tableHelpers

export { getRangeFromMatrix }
