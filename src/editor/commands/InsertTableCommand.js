import InsertNodeCommand from './InsertNodeCommand'
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

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
    let thead = tx.createElement('thead')
    let headTr = tx.createElement('tr')
    for (let j = 0; j < colNumber; j++) {
      headTr.append(
        tx.createElement('th').text(ALPHABET[j % ALPHABET.length])
      )
    }
    for (let i = 0; i < rowNumber; i++) {
      let tr = tx.createElement('tr')
      for (let j = 0; j < colNumber; j++) {
        let td = tx.createElement('td').text('')
        tr.appendChild(td)
      }
      tbody.appendChild(tr)
    }
    table.append(
      thead.append(headTr),
      tbody
    )
    return table
  }
}
