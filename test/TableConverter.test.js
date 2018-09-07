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
    return row.map(cell => cell.textContent)
  })
  let expectedContent = [
    ['A', 'B', 'C'],
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9']
  ]
  t.deepEqual(textContent, expectedContent, 'cell content should have been converted correctly')
  t.ok(cellMatrix[0].every(cell => cell.getAttribute('heading')), 'all cells in first row should be heading')
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
