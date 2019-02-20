import { Tool } from '../../kit'

export default class InsertTableTool extends Tool {
  getClassNames () {
    return 'sc-insert-table-tool sc-tool'
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
