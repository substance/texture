import { Command } from 'substance'
import { getColumnLabel } from '../../article/tableHelpers'
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
      this.generateTable(tx, params.columns, params.rows)
    )
    return tableWrap
  }

  generateTable(tx, colNumber, rowNumber) {
    let $$ = tx.createElement.bind(tx)
    let table = $$('table')
    let headRow = $$('table-row')
    for (let j = 0; j < colNumber; j++) {
      headRow.append(
        $$('table-cell')
          .attr('heading', true)
          .text(getColumnLabel(colNumber))
      )
    }
    table.append(headRow)
    for (let i = 0; i < rowNumber; i++) {
      let row = $$('table-row')
      for (let j = 0; j < colNumber; j++) {
        row.append($$('table-cell').text(''))
      }
      table.append(row)
    }
    return table
  }
}

export class InsertCellsCommand extends Command {

  getCommandState(params) {
    const sel = params.selection
    if (sel && sel.customType === 'table') {
      let selData = sel.data
      let startRow = Math.min(selData.anchorRow, selData.focusRow)
      let endRow = Math.max(selData.anchorRow, selData.focusRow)
      let startCol = Math.min(selData.anchorCol, selData.focusCol)
      let endCol = Math.max(selData.anchorCol, selData.focusCol)
      return {
        disabled: false,
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
    let tableId = sel.data.nodeId
    let surfaceId = sel.surfaceId
    let editing = new TableEditing(editorSession, tableId, surfaceId)
    return this.__execute(editing, commandState)
  }

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

export class DeleteCellsCommand extends InsertCellsCommand {

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
