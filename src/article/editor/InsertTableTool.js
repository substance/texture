import { ToggleTool } from 'substance'

class InsertTableTool extends ToggleTool {

  getClassNames() {
    return 'sc-insert-table-tool'
  }

  onClick() {
    const rows = 3
    const columns = 5
    this.executeCommand({
      rows: rows,
      columns: columns
    })
  }

}

export default InsertTableTool
