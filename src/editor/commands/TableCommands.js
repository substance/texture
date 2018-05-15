import { Command, getRangeFromMatrix, flatten } from 'substance'
import { getColumnLabel, getCellRange } from '../../article/tableHelpers'
import TableEditing from '../../article/TableEditing'
import InsertNodeCommand from './InsertNodeCommand'

export class InsertTableCommand extends InsertNodeCommand {

  createNode(tx, params) {
    let tableWrap = tx.createElement('table-wrap')
    tableWrap.append(
      tx.createElement('object-id').text(tableWrap.id),
      tx.createElement('title').text('Table title'),
      tx.createElement('caption').append(
        tx.createElement('p').text('Table caption')
      ),
      this.generateTable(tx, params.rows, params.columns)
    )
    return tableWrap
  }

  generateTable(tx, nrows, ncols) {
    let $$ = tx.createElement.bind(tx)
    let table = $$('table')
    let headRow = $$('table-row')
    for (let j = 0; j < ncols; j++) {
      headRow.append(
        $$('table-cell')
          .attr('heading', true)
          .text(getColumnLabel(j))
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
}

class BasicTableCommand extends Command {

  getCommandState(params, context) {
    const sel = params.selection
    if (sel && sel.customType === 'table') {
      let { nodeId, anchorCellId, focusCellId } = sel.data
      let editorSession = this._getEditorSession(params, context)
      let doc = editorSession.getDocument()
      let table = doc.get(nodeId)
      let anchorCell = doc.get(anchorCellId)
      let focusCell = doc.get(focusCellId)
      let { startRow, startCol, endRow, endCol } = getCellRange(table, anchorCellId, focusCellId)
      return {
        disabled: false,
        anchorCell, focusCell,
        startRow, endRow, startCol, endCol,
        nrows: endRow-startRow+1,
        ncols: endCol-startCol+1
      }
    }
    // otherwise
    return {
      disabled: true
    }
  }

  execute(params, context) {
    const commandState = params.commandState
    if (commandState.disabled) return
    let editorSession = this._getEditorSession(params, context)
    let sel = params.selection
    let nodeId = sel.data.nodeId
    let surfaceId = sel.surfaceId
    let editing = new TableEditing(editorSession, nodeId, surfaceId)
    return this.__execute(editing, commandState)
  }
}


export class InsertCellsCommand extends BasicTableCommand {

  __execute(editing, { startRow, startCol, endRow, endCol, ncols, nrows }) {
    let insertPos = this.config.spec.pos
    let dim = this.config.spec.dim
    if (dim === 'row') {
      let pos = insertPos === 'below' ? endRow+1 : startRow
      editing.insertRows(pos, nrows)
    } else {
      let pos = insertPos === 'right' ? endCol+1 : startCol
      editing.insertCols(pos, ncols)
    }
    return true
  }

}

export class DeleteCellsCommand extends BasicTableCommand {

  __execute(editing, { startRow, startCol, nrows, ncols }) {
    let dim = this.config.spec.dim
    if (dim === 'row') {
      editing.deleteRows(startRow, nrows)
    } else {
      editing.deleteCols(startCol, ncols)
    }
    return true
  }
}


export class TableSelectAllCommand extends BasicTableCommand {

  __execute(editing) {
    editing.selectAll()
    return true
  }

}

export class ToggleCellHeadingCommand extends BasicTableCommand {

  getCommandState(params, context) {
    const sel = params.selection
    if (sel && sel.customType === 'table') {
      let { nodeId, anchorCellId, focusCellId } = sel.data
      let editorSession = this._getEditorSession(params, context)
      let doc = editorSession.getDocument()
      let table = doc.get(nodeId)
      let { startRow, startCol, endRow, endCol } = getCellRange(table, anchorCellId, focusCellId)
      let cells = getRangeFromMatrix(table.getCellMatrix(), startRow, startCol, endRow, endCol, true)
      cells = flatten(cells).filter(c => !c.shadowed)
      let onlyHeadings = true
      for (let i = 0; i < cells.length; i++) {
        if (!cells[i].getAttribute('heading')) {
          onlyHeadings = false
          break
        }
      }
      return {
        disabled: false,
        active: onlyHeadings,
        heading: !onlyHeadings,
        cellIds: cells.map(c => c.id)
      }
    }
    // otherwise
    return {
      disabled: true
    }
  }

  __execute(editing, { cellIds, heading }) {
    editing.setHeading(cellIds, heading)
    return true
  }

}

export class ToggleCellMergeCommand extends BasicTableCommand {

  getCommandState(params, context) {
    const sel = params.selection
    if (sel && sel.customType === 'table') {
      let { nodeId, anchorCellId, focusCellId } = sel.data
      let editorSession = this._getEditorSession(params, context)
      let doc = editorSession.getDocument()
      let table = doc.get(nodeId)
      let { startRow, startCol, endRow, endCol } = getCellRange(table, anchorCellId, focusCellId)
      let cells = getRangeFromMatrix(table.getCellMatrix(), startRow, startCol, endRow, endCol, true)
      cells = flatten(cells).filter(c => !c.shadowed)
      let onlyMerged = true
      for (let i = 0; i < cells.length; i++) {
        let cell = cells[i]
        let rowspan = cell.getAttribute('rowspan')
        let colspan = cell.getAttribute('colspan')
        if (!rowspan && !colspan) {
          onlyMerged = false
          break
        }
      }
      return {
        disabled: false,
        active: onlyMerged,
        merge: !onlyMerged,
        cellIds: cells.map(c => c.id)
      }
    }
    // otherwise
    return {
      disabled: true
    }
  }

  __execute(editing, { cellIds, merge }) {
    if (merge) {
      editing.merge(cellIds)
    } else {
      editing.unmerge(cellIds)
    }
    return true
  }

}