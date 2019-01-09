export default class TableConverter {
  get tagName () { return 'table' }

  get type () { return 'table' }

  import (el, node, importer) {
    const doc = importer.state.doc
    const $$ = (type, props = {}) => doc.create(Object.assign(props, { type }))
    let rows = el.findAll('tr')
    let newRows = rows.map(tr => {
      return {
        id: tr.id,
        children: []
      }
    })
    // ATTENTION: this code is not 'idiomatic' as it does not delegate to converters for children elements
    // and instead creates document nodes on the fly
    for (let i = 0; i < rows.length; i++) {
      let tr = rows[i]
      let newRow = newRows[i]
      let children = tr.getChildren()
      for (let j = 0, k = 0; j < children.length; j++, k++) {
        // skipping spanned cells which is necessary
        // because HTML tables have a sparse representation w.r.t. span
        while (newRow.children[k]) k++
        let c = children[j]
        let attributes = {}
        if (c.is('th')) attributes.heading = true
        let rowspan = c.attr('rowspan')
        if (rowspan) {
          rowspan = Math.max(1, parseInt(rowspan, 10))
          if (rowspan > 1) {
            attributes.rowspan = rowspan
          }
        }
        let colspan = c.attr('colspan')
        if (colspan) {
          colspan = Math.max(1, parseInt(colspan, 10))
          if (colspan > 1) {
            attributes.colspan = colspan
          }
        }
        // flag all spanned cells so that we can skip them
        _fillSpanned($$, newRows, i, k, rowspan, colspan)
        let cell = $$('table-cell', {
          id: c.id,
          heading: attributes['heading'],
          rowspan: attributes['rowspan'],
          colspan: attributes['colspan'],
          content: importer.annotatedText(c, [c.id, 'content'])
        })
        newRows[i].children[k] = cell
      }
    }
    node.rows = newRows.map(data => {
      let row = $$('table-row', {
        id: data.id,
        cells: data.children.map(cell => cell.id)
      })
      return row.id
    })
  }

  export (table, el, exporter) {
    const $$ = exporter.$$
    let htmlTable = $$('table').attr('id', table.id)
    let tbody = $$('tbody')
    let rows = table.resolve('rows')
    let matrix = table.getCellMatrix()
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i]
      let cells = matrix[i]
      let tr = $$('tr').attr('id', row.id)
      for (let j = 0; j < cells.length; j++) {
        let cell = cells[j]
        if (cell.shadowed) continue
        let el = $$(cell.heading ? 'th' : 'td')
        let attributes = { id: cell.id }
        let rowspan = cell.rowspan
        if (rowspan) {
          if (rowspan > 1) {
            attributes.rowspan = String(rowspan)
          }
        }
        let colspan = cell.colspan
        if (colspan) {
          if (colspan > 1) {
            attributes.colspan = String(colspan)
          }
        }
        el.attr(attributes)
        el.append(exporter.annotatedText(cell.getPath()))
        tr.append(el)
      }
      tbody.append(tr)
    }
    htmlTable.append(tbody)
    return htmlTable
  }
}

function _fillSpanned ($$, newRows, row, col, rowspan, colspan) {
  if (!rowspan && !colspan) return
  if (!rowspan) rowspan = 1
  if (!colspan) colspan = 1
  for (let i = row; i < row + rowspan; i++) {
    for (let j = col; j < col + colspan; j++) {
      if (i === row && j === col) continue
      newRows[i].children[j] = $$('table-cell')
    }
  }
}
