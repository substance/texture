import { NodeComponent, TextPropertyComponent } from 'substance'

export default class TableComponent extends NodeComponent {

  shouldRerender() {
    return false
  }

  render($$) {
    let el = $$('table').addClass('sc-table')
    let node = this.props.node
    let rows = node.getChildren()
    let matrix = rows.map(row => row.getChildren())
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i]
      let cells = matrix[i]
      let tr = $$('tr').attr('id', row.id)
      for (let j = 0; j < cells.length; j++) {
        while (!cells[j]) j++
        if (j >= cells.length) break
        let cell = cells[j]
        let cellEl = $$(cell.attr('heading') ? 'th' : 'td')
        let attributes = { id: cell.id }
        let rowspan = cell.attr('rowspan') || 0
        if (rowspan) {
          rowspan = parseInt(rowspan, 10)
          attributes.rowspan = rowspan
        }
        let colspan = cell.attr('colspan') || 0
        if (colspan) {
          colspan = parseInt(colspan, 10)
          attributes.colspan = colspan
        }
        cellEl.attr(attributes)
        cellEl.append($$(TextPropertyComponent, {
          path: cell.getPath()
        })).ref(cell.id)
        _clearSpanned(matrix, i, j, rowspan, colspan)
        tr.append(cellEl)
      }
      el.append(tr)
    }
    return el
  }
}

function _clearSpanned(matrix, row, col, rowspan, colspan) {
  if (!rowspan && !colspan) return
  for (let i = row; i <= row + rowspan; i++) {
    for (let j = col; j <= col + colspan; j++) {
      if (i === row && j === col) continue
      matrix[i][j] = false
    }
  }
}