import InsertNodeCommand from './InsertNodeCommand'

export default class InsertTableCommand extends InsertNodeCommand {

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
    let table = tx.createElement('table')
    let tbody = tx.createElement('tbody')
    for (let i = 0; i < rowNumber; i++) {
      let tr = tx.createElement('tr')
      for (let j = 0; j < colNumber; j++) {
        let td = tx.createElement('td').text('')
        tr.appendChild(td)
      }
      tbody.appendChild(tr)
    }
    table.appendChild(tbody)
    return table
  }
}
