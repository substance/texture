import { test } from 'substance-test'
import { DefaultDOMElement } from 'substance'
import {
  InternalArticleDocument, InternalArticleSchema,
  createJatsImporter, createJatsExporter, createEmptyJATS
} from '../index'

const SIMPLE = `
<table>
  <tr><th>A</th><th>B</th><th>C</th></tr>
  <tr><td>1</td><td>2</td><td>3</td></tr>
  <tr><td>4</td><td>5</td><td>6</td></tr>
  <tr><td>7</td><td>8</td><td>9</td></tr>
</table>
`

test('TableConverter: import simple table', t => {
  let el = DefaultDOMElement.parseSnippet(SIMPLE.trim(), 'xml')
  let table = _importTable(el)
  t.deepEqual(table.getDimensions(), [4, 3], 'table should have correct dimensions')
  let cellMatrix = table.getCellMatrix()
  let textContent = cellMatrix.map(row => {
    return row.map(cell => cell.getText())
  })
  let expectedContent = [
    ['A', 'B', 'C'],
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9']
  ]
  t.deepEqual(textContent, expectedContent, 'cell content should have been converted correctly')
  t.ok(cellMatrix[0].every(cell => cell.heading), 'all cells in first row should be heading')
  t.end()
})

test('TableConverter: export simple table', t => {
  let el = DefaultDOMElement.parseSnippet(SIMPLE.trim(), 'xml')
  let table = _importTable(el)
  let tableEl = _exportTable(table)
  let tbody = tableEl.find('tbody')
  t.notNil(tbody, 'table should have a tbody')
  let trs = tbody.findAll('tr')
  t.equal(trs.length, 4, '.. with 4 rows')

  let cellTagNames = trs.map(tr => {
    return tr.getChildren().map(cell => cell.tagName)
  })
  let expectedCellTagNames = [
    ['th', 'th', 'th'],
    ['td', 'td', 'td'],
    ['td', 'td', 'td'],
    ['td', 'td', 'td']
  ]
  t.deepEqual(cellTagNames, expectedCellTagNames, 'cells should have correct tagName')
  let textContent = trs.map(tr => {
    return tr.getChildren().map(cell => cell.textContent)
  })
  let expectedContent = [
    ['A', 'B', 'C'],
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9']
  ]
  t.deepEqual(textContent, expectedContent, 'cells should have correct content')
  t.end()
})

const COL_SPAN_1 = `
<table>
  <tr><th>A</th><th>B</th><th>C</th><th>D</th></tr>
  <tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>
  <tr><td>5</td><td>6</td><td>7</td><td>8</td></tr>
  <tr id="tr4"><td colspan="2">9</td><td>11</td><td>12</td></tr>
  <tr><td>13</td><td>14</td><td>15</td><td>16</td></tr>
</table>
`

test('TableConverter: import table with col span (1)', t => {
  let el = DefaultDOMElement.parseSnippet(COL_SPAN_1.trim(), 'xml')
  let table = _importTable(el)
  t.deepEqual(table.getDimensions(), [5, 4], 'table should have correct dimensions')
  t.ok(table.resolve('rows').every(row => row.cells.length === 4), 'internally every row should have 4 cells')
  let cellMatrix = table.getCellMatrix()
  let masterCell = cellMatrix[3][0]
  let spannedCell = cellMatrix[3][1]
  t.ok(spannedCell.isShadowed(), 'cell in 4th row and 2nd column should be shadowed')
  t.ok(spannedCell.getMasterCell() === masterCell, '.. by the cell in the first column')
  t.end()
})

test('TableConverter: export table with col span (1)', t => {
  let el = DefaultDOMElement.parseSnippet(COL_SPAN_1.trim(), 'xml')
  let table = _importTable(el)
  let tableEl = _exportTable(table)
  let tr = tableEl.find('#tr4')
  let td = tr.getChildAt(0)
  t.equal(tr.getChildCount(), 3, '4th row should have 3 cells')
  t.equal(td.getAttribute('colspan'), '2', 'its first cell should have colspan=2')
  t.end()
})

const COL_SPAN_2 = `
<table>
  <tr><th>A</th><th>B</th><th>C</th><th>D</th></tr>
  <tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>
  <tr><td>5</td><td>6</td><td>7</td><td>8</td></tr>
  <tr><td>9</td><td>10</td><td>11</td><td>12</td></tr>
  <tr id="tr5"><td colspan="2">13</td><td>15</td><td>16</td></tr>
</table>
`

test('TableConverter: import table with col span (2)', t => {
  let el = DefaultDOMElement.parseSnippet(COL_SPAN_2.trim(), 'xml')
  let table = _importTable(el)
  t.deepEqual(table.getDimensions(), [5, 4], 'table should have correct dimensions')
  t.ok(table.resolve('rows').every(row => row.cells.length === 4), 'internally every row should have 4 cells')
  let cellMatrix = table.getCellMatrix()
  let masterCell = cellMatrix[4][0]
  let spannedCell = cellMatrix[4][1]
  t.ok(spannedCell.isShadowed(), 'cell in 5th row and 2nd column should be shadowed')
  t.ok(spannedCell.getMasterCell() === masterCell, '.. by the cell in the first column')
  t.end()
})

test('TableConverter: export table with col span (2)', t => {
  let el = DefaultDOMElement.parseSnippet(COL_SPAN_2.trim(), 'xml')
  let table = _importTable(el)
  let tableEl = _exportTable(table)
  let tr = tableEl.find('#tr5')
  let td = tr.getChildAt(0)
  t.equal(tr.getChildCount(), 3, '5th row should have 3 cells')
  t.equal(td.getAttribute('colspan'), '2', 'its first cell should have colspan=2')
  t.end()
})

const COL_SPAN_3 = `
<table>
  <tr><th>A</th><th>B</th><th>C</th><th>D</th></tr>
  <tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>
  <tr><td>5</td><td>6</td><td>7</td><td>8</td></tr>
  <tr id="tr4"><td colspan="4">9</td></tr>
  <tr><td>13</td><td>14</td><td>15</td><td>16</td></tr>
</table>
`

test('TableConverter: import table with col span (3)', t => {
  let el = DefaultDOMElement.parseSnippet(COL_SPAN_3.trim(), 'xml')
  let table = _importTable(el)
  t.deepEqual(table.getDimensions(), [5, 4], 'table should have correct dimensions')
  t.ok(table.resolve('rows').every(row => row.cells.length === 4), 'internally every row should have 4 cells')
  let cellMatrix = table.getCellMatrix()
  let row4 = cellMatrix[3]
  let masterCell = cellMatrix[3][0]
  t.ok(row4.slice(1).every(cell => cell.isShadowed()), 'all cells in 4th should be shadowed')
  t.notOk(masterCell.isShadowed(), '.. except the first cell')
  t.ok(row4.slice(1).every(cell => cell.getMasterCell() === masterCell), '.. which should be the master cell of the others')
  t.end()
})

test('TableConverter: export table with col span (3)', t => {
  let el = DefaultDOMElement.parseSnippet(COL_SPAN_3.trim(), 'xml')
  let table = _importTable(el)
  let tableEl = _exportTable(table)
  let tr = tableEl.find('#tr4')
  let td = tr.getChildAt(0)
  t.equal(tr.getChildCount(), 1, '4th row should have only one cell')
  t.equal(td.getAttribute('colspan'), '4', '.. with colspan=4')
  t.end()
})

const ROW_SPAN_1 = `
<table>
<tr><th>A</th><th>B</th><th>C</th><th>D</th></tr>
<tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>
<tr><td>5</td><td>6</td><td>7</td><td>8</td></tr>
<tr id="tr4"><td>9</td><td rowspan="2">10</td><td>11</td><td>12</td></tr>
<tr id="tr5"><td>13</td><td>15</td><td>16</td></tr>
</table>
`

test('TableConverter: import table with row span (1)', t => {
  let el = DefaultDOMElement.parseSnippet(ROW_SPAN_1.trim(), 'xml')
  let table = _importTable(el)
  t.deepEqual(table.getDimensions(), [5, 4], 'table should have correct dimensions')
  t.ok(table.resolve('rows').every(row => row.cells.length === 4), 'internally every row should have 4 cells')
  let cellMatrix = table.getCellMatrix()
  let row4 = cellMatrix[3]
  let row5 = cellMatrix[4]
  t.ok(row5[1].isShadowed(), 'cell in last row and second column should be shadowed')
  t.ok(row5[1].getMasterCell() === row4[1], 'its master cell should be the cell in the previous row')
  t.end()
})

test('TableConverter: export table with row span (1)', t => {
  let el = DefaultDOMElement.parseSnippet(ROW_SPAN_1.trim(), 'xml')
  let table = _importTable(el)
  let tableEl = _exportTable(table)
  let tr4 = tableEl.find('#tr4')
  let tr5 = tableEl.find('#tr5')
  t.equal(tr4.getChildAt(1).getAttribute('rowspan'), '2', 'the second cell in the 4th row should have rowspan=2')
  t.equal(tr5.getChildCount(), 3, 'the last row should have only 3 children')
  t.end()
})

function _importTable (el) {
  // TODO: create a minimal document, and the JATS importer
  // then run the converter and see if the body node has the proper content
  let doc = InternalArticleDocument.createEmptyArticle(InternalArticleSchema)
  let importer = createJatsImporter(doc)
  return importer.convertElement(el)
}

function _exportTable (table) {
  let jats = createEmptyJATS()
  let exporter = createJatsExporter(jats, table.getDocument())
  return exporter.convertNode(table)
}
