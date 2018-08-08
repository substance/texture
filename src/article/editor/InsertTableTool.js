import { ToggleTool } from '../../kit'

export default class InsertTableTool extends ToggleTool {
  getClassNames () {
    return 'sc-insert-table-tool'
  }

  onClick () {
    const rows = 3
    const columns = 5
    this.executeCommand({
      rows: rows,
      columns: columns
    })
  }
}
