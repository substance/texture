export default class ConvertTable {

  import(dom) {
    const $$ = dom.createElement.bind(dom)
    let tables = dom.findAll('table')

    tables.forEach(htmlTable => {
      let textureTable = $$('table')
      textureTable.id = htmlTable.id
      let rows = htmlTable.findAll('tr')
      let newRows = rows.map(tr => {
        return {
          id: tr.id,
          children: []
        }
      })
      for (let i = 0; i < rows.length; i++) {
        let tr = rows[i]
        let newRow = newRows[i]
        let children = tr.getChildren()
        for (let j=0, k=0; j < children.length; j++, k++) {
          // skipping spanned cells which is necessary
          // because HTML tables have a sparse representation
          // w.r.t. spanning
          while (newRow.children[k]) k++
          let c = children[j]

          let attributes = {}
          if(c.is('th')) attributes.heading = true
          let rowspan = c.attr('rowspan') || 0
          if (rowspan) {
            rowspan = parseInt(rowspan, 10)
            attributes.rowspan = rowspan
          }
          let colspan = c.attr('colspan') || 0
          if (colspan) {
            colspan = parseInt(colspan, 10)
            attributes.colspan = colspan
          }
          // flag all spanned cells so that we can skip them
          _fillSpanned(i, k, rowspan, colspan)
          let cell = $$('table-cell')
          cell.id = c.id
          cell.attr(attributes)
          cell.setInnerXML(c.getInnerXML())
          newRows[i].children[k] = cell
        }
      }
      textureTable.append(
        newRows.map(data => {
          return $$('table-row')
            .attr('id', data.id)
            .append(data.children)
        })
      )
      htmlTable.parentNode.replaceChild(htmlTable, textureTable)

      function _fillSpanned(row, col, rowspan, colspan) {
        if (!rowspan && !colspan) return
        for (let i = row; i <= row + rowspan; i++) {
          for (let j = col; j <= col + colspan; j++) {
            if (i === row && j === col) continue
            newRows[i].children[j] = $$('table-cell')
          }
        }
      }
    })
  }

  export(dom) {
    const $$ = dom.createElement.bind(dom)
    let tables = dom.findAll('table')
    tables.forEach(table => {
      let htmlTable = $$('table').attr('id', table.id)
      let tbody = $$('tbody')
      let rows = table.findAll('table-row')
      let matrix = rows.map(row => row.getChildren())
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i]
        let cells = matrix[i]
        let tr = $$('tr').attr('id', row.id)
        for (let j = 0; j < cells.length; j++) {
          while (!cells[j]) j++
          if (j >= cells.length) break
          let cell = cells[j]
          let el = $$(cell.attr('heading') ? 'th' : 'td')
          let attributes = { id: cell.id }
          let rowspan = cell.attr('rowspan')
          if (rowspan) {
            rowspan = parseInt(rowspan, 10)
            attributes.rowspan = rowspan
          }
          let colspan = cell.attr('colspan')
          if (colspan) {
            colspan = parseInt(colspan, 10)
            attributes.colspan = colspan
          }
          el.attr(attributes)
          _clearSpanned(i, j, rowspan, colspan)
          el.setInnerXML(cell.getInnerXML())
          tr.append(el)
        }
        tbody.append(tr)
      }
      htmlTable.append(tbody)
      table.parentNode.replaceChild(table, htmlTable)

      function _clearSpanned(row, col, rowspan, colspan) {
        if (!rowspan && !colspan) return
        for (let i = row; i <= row + rowspan; i++) {
          for (let j = col; j <= col + colspan; j++) {
            if (i === row && j === col) continue
            matrix[i][j] = false
          }
        }
      }
    })
  }

}