import { xmlNodeHelpers } from 'substance'

export function createTableSelection(data) {
  if (!data.type) data.type = 'range'
  // integrity check:
  switch (data.type) {
    case 'range': {
      if (!isFinite(data.anchorRow) || !isFinite(data.anchorCol) ||
        !isFinite(data.focusRow) || !isFinite(data.focusCol)) {
        throw new Error('Invalid arguments')
      }
      break
    }
    default:
      throw new Error('Invalid type for table selection')
  }

  return {
    type: 'custom',
    customType: 'table',
    data: data
  }
}

export function shifted(table, selData, dr, dc, shift) {
  let newSelData = Object.assign({}, selData)
  // TODO: move viewport if necessary
  let newFocusRow, newFocusCol
  if (!shift) {
    [newFocusRow, newFocusCol] = clamped(table, selData.anchorRow+dr, selData.anchorCol+dc)
    newSelData.anchorRow = newSelData.focusRow = newFocusRow
    newSelData.anchorCol = newSelData.focusCol = newFocusCol
  } else {
    [newFocusRow, newFocusCol] = clamped(table, selData.focusRow+dr, selData.focusCol+dc)
    newSelData.focusRow = newFocusRow
    newSelData.focusCol = newFocusCol
  }
  return newSelData
}

export function clamped(table, rowIdx, colIdx) {
  const N = table.getRowCount()
  const M = table.getColumnCount()
  return [
    Math.max(0, Math.min(N-1, rowIdx)),
    Math.max(0, Math.min(M-1, colIdx)),
  ]
}

export function getSelectionData(sel) {
  if (sel && sel.customType === 'table') {
    return sel.data
  }
  return {}
}

export function getSelectedRange(table, selData) {
  let startRow = Math.min(selData.anchorRow, selData.focusRow)
  let endRow = Math.max(selData.anchorRow, selData.focusRow)
  let startCol = Math.min(selData.anchorCol, selData.focusCol)
  let endCol = Math.max(selData.anchorCol, selData.focusCol)
  if (selData.type === 'columns') {
    startRow = 0
    endRow = table.getRowCount() - 1
  } else if (selData.type === 'rows') {
    startCol = 0
    endCol = table.getColumnCount() - 1
  }
  return { startRow, endRow, startCol, endCol }
}

export function getRowCol(cell) {
  let rowIdx, colIdx
  if (cell.hasOwnProperty('rowIdx') && cell.hasOwnProperty('colIdx')) {
    rowIdx = cell.rowIdx
    colIdx = cell.colIdx
  } else {
    let row = cell.getParent()
    let table = row.getParent()
    rowIdx = xmlNodeHelpers.getChildPos(table, row)
    colIdx = xmlNodeHelpers.getChildPos(row, cell)
  }
  return [rowIdx, colIdx]
}

export function computeSelectionRectangle(ulRect, lrRect) {
  let selRect = {}
  selRect.top = ulRect.top
  selRect.left = ulRect.left
  selRect.width = lrRect.left + lrRect.width - selRect.left
  selRect.height = lrRect.top + lrRect.height - selRect.top
  return selRect
}
