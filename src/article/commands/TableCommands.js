import { Command, getRangeFromMatrix, flatten } from 'substance'

const DISABLED = { disabled: true }

// TODO: pull commands into single files.
// and move manipulation code into ArticleAPI

class BasicTableCommand extends Command {
  getCommandState (params, context) { // eslint-disable-line no-unused-vars
    const tableApi = context.api.getTableAPI()
    if (!tableApi.isTableSelected()) return DISABLED
    const selData = tableApi._getSelectionData()
    return Object.assign({ disabled: false }, selData)
  }

  execute (params, context) { // eslint-disable-line no-unused-vars
    const commandState = params.commandState
    if (commandState.disabled) return

    const tableApi = context.api.getTableAPI()
    return this._execute(tableApi, commandState)
  }
}

export class InsertCellsCommand extends BasicTableCommand {
  _execute (tableApi, { ncols, nrows }) {
    const mode = this.config.spec.pos
    const dim = this.config.spec.dim
    if (dim === 'row') {
      tableApi.insertRows(mode, nrows)
    } else {
      tableApi.insertCols(mode, ncols)
    }
    return true
  }
}

export class DeleteCellsCommand extends BasicTableCommand {
  _execute (tableApi, { startRow, startCol, nrows, ncols }) {
    const dim = this.config.spec.dim
    if (dim === 'row') {
      tableApi.deleteRows()
    } else {
      tableApi.deleteCols()
    }
    return true
  }
}

export class TableSelectAllCommand extends BasicTableCommand {
  _execute (tableApi) {
    tableApi.selectAll()
    return true
  }
}

export class ToggleCellHeadingCommand extends BasicTableCommand {
  getCommandState (params, context) { // eslint-disable-line no-unused-vars
    let commandState = super.getCommandState(params, context)
    if (commandState.disabled) return commandState

    let { table, startRow, endRow, startCol, endCol } = commandState
    let cells = getRangeFromMatrix(table.getCellMatrix(), startRow, startCol, endRow, endCol, true)
    cells = flatten(cells).filter(c => !c.shadowed)
    let onlyHeadings = true
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].heading) {
        onlyHeadings = false
        break
      }
    }
    return Object.assign(commandState, {
      active: onlyHeadings,
      cellIds: cells.map(c => c.id)
    })
  }

  _execute (tableApi, { cellIds, heading }) {
    tableApi.toggleHeading(cellIds)
    return true
  }
}

export class ToggleCellMergeCommand extends BasicTableCommand {
  getCommandState (params, context) { // eslint-disable-line no-unused-vars
    let commandState = super.getCommandState(params, context)
    if (commandState.disabled) return commandState

    let { table, nrows, ncols, startRow, startCol } = commandState
    let cell = table.getCell(startRow, startCol)
    let rowspan = cell.rowspan
    let colspan = cell.colspan
    // ATTENTION: at the moment the selection is expressed in absolute
    // rows and cols, not considering colspans and rowspans
    // If a single cell with row- or colspan is selected, then
    // nrows=rowspan and ncols=colspan
    if (nrows > 1 || ncols > 1) {
      if (rowspan < nrows || colspan < ncols) {
        commandState.merge = true
      } else {
        commandState.active = true
        commandState.unmerge = true
      }
    }
    // only enable if one merge option is enabled
    // TODO: if table commands are enabled this command should
    // be shown even if disabled
    if (!commandState.merge && !commandState.unmerge) {
      return DISABLED
    }
    return commandState
  }

  _execute (tableApi, { merge, unmerge }) {
    if (merge) {
      tableApi.merge()
    } else if (unmerge) {
      tableApi.unmerge()
    }
    return true
  }
}
