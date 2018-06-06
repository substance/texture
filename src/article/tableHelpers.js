import { tableHelpers } from 'substance'

export function createTableSelection(data) {
  if (!data.anchorCellId || !data.focusCellId) throw new Error('Invalid selection data')
  return {
    type: 'custom',
    customType: 'table',
    data: data
  }
}

export function getSelectionData(sel) {
  if (sel && sel.customType === 'table') {
    return sel.data
  }
  return {}
}

export function getSelectedRange(table, selData) {
  return getCellRange(table, selData.anchorCellId, selData.focusCellId)
}

export function computeSelectionRectangle(ulRect, lrRect) {
  let selRect = {}
  selRect.top = ulRect.top
  selRect.left = ulRect.left
  selRect.width = lrRect.left + lrRect.width - selRect.left
  selRect.height = lrRect.top + lrRect.height - selRect.top
  return selRect
}

export function getCellRange(table, anchorCellId, focusCellId) {
  let anchorCell = table.get(anchorCellId)
  let focusCell = table.get(focusCellId)
  let startRow = Math.min(anchorCell.rowIdx, focusCell.rowIdx)
  let startCol = Math.min(anchorCell.colIdx, focusCell.colIdx)
  let endRow = Math.max(anchorCell.rowIdx+anchorCell.rowspan-1,focusCell.rowIdx+focusCell.rowspan-1)
  let endCol = Math.max(anchorCell.colIdx+anchorCell.colspan-1,focusCell.colIdx+focusCell.colspan-1)
  return { startRow, startCol, endRow, endCol }
}

export function computeUpdatedSelection(table, selData, dr, dc, expand) {
  let focusCellId = selData.focusCellId
  let focusCell = table.get(focusCellId)
  let rowIdx = focusCell.rowIdx
  let colIdx = focusCell.colIdx
  let rowspan = focusCell.rowspan
  let colspan = focusCell.colspan
  let newFocusCell
  if (dr) {
    if (dr < 0) {
      newFocusCell = table.getCell(rowIdx+dr, colIdx)
    } else if (dr > 0) {
      newFocusCell = table.getCell(rowIdx+rowspan-1+dr, colIdx)
    }
  } else if (dc) {
    if (dc < 0) {
      newFocusCell = table.getCell(rowIdx, colIdx+dc)
    } else if (dc > 0) {
      newFocusCell = table.getCell(rowIdx, colIdx+colspan-1+dc)
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

export function generateTable (doc, nrows, ncols) {
  let $$ = doc.createElement.bind(doc)
  let table = $$('table')
  let headRow = $$('table-row')
  for (let j = 0; j < ncols; j++) {
    headRow.append(
      $$('table-cell')
        .attr('heading', true)
        .text(tableHelpers.getColumnLabel(j))
    )
  }
  table.append(headRow)
  for (let i = 0; i < nrows; i++) {
    let row = $$('table-row')
    for (let j = 0; j < ncols; j++) {
      row.append($$('table-cell').text(''))
    }
    table.append(row)
  }
  return table
}
