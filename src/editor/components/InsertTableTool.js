import { ToggleTool } from 'substance'

class InsertTableTool extends ToggleTool {

  getClassNames() {
    return 'sc-insert-table-tool'
  }

  onClick() {
    const rows = 3
    // eslint-disable-next-line
    let columns = window.prompt('How many columns should your table have?', 3)

    this.executeCommand({
      rows: rows,
      columns: columns
    })
  }

}

export default InsertTableTool
