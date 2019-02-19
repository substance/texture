import { parseKeyCombo, DefaultDOMElement, getRangeFromMatrix, isArray, flattenOften, isNil } from 'substance'
import { test } from 'substance-test'
import {
  TableComponent, tableHelpers
} from '../index'
import { getMountPoint, DOMEvent, ClipboardEventData } from './shared/testHelpers'
import setupTestArticleSession from './shared/setupTestArticleSession'
import {
  openManuscriptEditor, loadBodyFixture, getDocument, setSelection, getApi,
  getEditorSession, annotate, getSelection, setCursor, openContextMenuAndFindTool,
  openMenuAndFindTool, PseudoFileEvent, selectNode, clickUndo
} from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

// TODO: test SHIFT selection handling
// TODO: find out why TableRow.getCellAt is not covered
// TODO: test merge and unmerge cells for selection with mixed cells
// TODO: test toggling cell heading for selection with mixed cells
// TODO: test pasting with resize with content containing merged cells and headings
// TODO: test pasting of cells with annotations

const SIMPLE_TABLE = `<table-wrap>
  <table id="t1">
    <tbody>
      <tr id="tr1">
        <td id="t11">aaaa</td>
        <td id="t12">bbbb</td>
        <td id="t13">cccc</td>
        <td id="t14">dddd</td>
      </tr>
      <tr id="tr2">
        <td id="t21">eeee</td>
        <td id="t22">ffff</td>
        <td id="t23">gggg</td>
        <td id="t24">hhhh</td>
      </tr>
      <tr id="tr3">
        <td id="t31">iiii</td>
        <td id="t32">jjjj</td>
        <td id="t33">kkkk</td>
        <td id="t34">llll</td>
        </tr>
      <tr id="tr4">
        <td id="t41">mmmm</td>
        <td id="t42">nnnn</td>
        <td id="t43">oooo</td>
        <td id="t44">pppp</td>
      </tr>
    </tbody>
  </table>
</table-wrap>`

const TABLE_WITH_MERGED_CELLS = `<table-wrap>
  <table>
    <tbody>
      <tr>
        <td id="t11" rowspan="2">aaaa</td>
        <td id="t12" colspan="2">bbbb</td>
        <td id="t14">dddd</td>
      </tr>
      <tr>
        <td id="t22">ffff</td>
        <td id="t23" rowspan="3" colspan="2">gggg</td>
      </tr>
      <tr>
        <td id="t31">iiii</td>
        <td id="t32">jjjj</td>
        </tr>
      <tr>
        <td id="t41">mmmm</td>
        <td id="t42">nnnn</td>
      </tr>
    </tbody>
  </table>
</table-wrap>`

const TABLE_WITH_HEADINGS = `<table-wrap>
  <table>
    <tbody>
      <tr>
        <th id="t11">aaaa</th>
        <th id="t12">bbbb</th>
        <th id="t13">cccc</th>
        <th id="t14">dddd</th>
      </tr>
      <tr>
        <th id="t21">eeee</th>
        <td id="t22">ffff</td>
        <td id="t23">gggg</td>
        <td id="t24">hhhh</td>
      </tr>
      <tr>
        <th id="t31">iiii</th>
        <td id="t32">jjjj</td>
        <td id="t33">kkkk</td>
        <td id="t34">llll</td>
        </tr>
      <tr>
        <th id="t41">mmmm</th>
        <td id="t42">nnnn</td>
        <td id="t43">oooo</td>
        <td id="t44">pppp</td>
      </tr>
    </tbody>
  </table>
</table-wrap>`

const LEFT = parseKeyCombo('Left')
const RIGHT = parseKeyCombo('Right')
const UP = parseKeyCombo('Up')
const DOWN = parseKeyCombo('Down')
const ENTER = parseKeyCombo('Enter')
const TAB = parseKeyCombo('Tab')
const DELETE = parseKeyCombo('Delete')
const BACKSPACE = parseKeyCombo('Backspace')
const ESCAPE = parseKeyCombo('Escape')
const SHIFT_ENTER = parseKeyCombo('Shift+Enter')

test('Table: mounting a table component', t => {
  let { table, context } = _setupEditorWithOneTable(t)
  let el = getMountPoint(t)
  let comp = new TableComponent(null, { node: table }, { context })
  comp.mount(el)
  t.notNil(el.find('.sc-table'), 'there should be a rendered table element')
  t.end()
})

test('Table: selecting a table', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let editorSession = getEditorSession(editor)
  editorSession.transaction(tx => {
    let body = tx.get('body')
    let table = tableHelpers.generateTable(tx, 10, 5, 'test-table')
    body.set('content', [table.id])
  })
  // a click (somewhere) on the isolated node should select the node
  let isolatedNode = editor.find('[data-id="test-table"]')
  isolatedNode.el.click()
  let sel = editorSession.getSelection()
  t.equal(sel.type, 'node', 'the selection should be a node selection')
  t.equal(sel.nodeId, 'test-table', '.. pointing to the inserted table should be selected')
  // but a click inside the table, e.g. on a cell should select the table cell
  let table = isolatedNode.find('.sc-table')
  let td = isolatedNode.find('td')
  table._onMousedown(new DOMEvent({ target: td.getNativeElement() }))
  td.el.click()
  sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'the selection should be a table selection')
  t.end()
})

test('Table: setting table selections', t => {
  let { editorSession, table, context } = _setupEditorWithOneTable(t)
  let el = getMountPoint(t)
  let comp = new TableComponent(null, { node: table }, { context })
  comp.mount(el)
  let matrix = table.getCellMatrix()
  let firstCell = matrix[0][0]
  // setting the selection on the first cell
  editorSession.setSelection(tableHelpers.createTableSelection(table.id, {
    anchorCellId: firstCell.id,
    focusCellId: firstCell.id
  }, comp.getId()))
  t.equal(comp.refs.selAnchor.el.css('visibility'), 'visible', 'the selection overlay for the selection anchor should be visible')
  t.equal(comp.refs.selRange.el.css('visibility'), 'visible', 'the selection overlay for the selection range should be visible')

  // setting the selection inside the first cell
  editorSession.setSelection({
    type: 'property',
    path: firstCell.getPath(),
    startOffset: 0,
    endOffset: 0
  })
  t.equal(comp.refs.selAnchor.el.css('visibility'), 'visible', 'the selection overlay for the selection anchor should be visible')
  t.equal(comp.refs.selRange.el.css('visibility'), 'hidden', 'the selection overlay for the selection range should be hidden')

  // nulling the selection
  editorSession.setSelection(null)
  t.equal(comp.refs.selAnchor.el.css('visibility'), 'hidden', 'the selection overlay for the selection anchor should be hidden')
  t.equal(comp.refs.selRange.el.css('visibility'), 'hidden', 'the selection overlay for the selection range should be hidden')

  t.end()
})

test('Table: mouse interactions', t => {
  let { editorSession, table, context } = _setupEditorWithOneTable(t)
  let el = getMountPoint(t)
  let comp = new TableComponent(null, { node: table }, { context })
  comp.mount(el)
  let matrix = table.getCellMatrix()
  let firstCell = matrix[0][0]
  let firstCellComp = comp.refs[firstCell.id]
  let secondCell = matrix[0][1]
  let secondCellComp = comp.refs[secondCell.id]

  // simulate a mouse down on the first cell
  comp._onMousedown(new DOMEvent({ target: firstCellComp.getNativeElement() }))
  comp._onMouseup(new DOMEvent({ target: firstCellComp.getNativeElement() }))

  let sel = editorSession.getSelection()
  t.comment('A click on the first cell ...')
  t.equal(sel.customType, 'table', '... the table should be selected,')
  t.equal(sel.data.anchorCellId, firstCell.id, '.. with anchor on first cell,')
  t.equal(sel.data.focusCellId, firstCell.id, '.. and focus on first cell,')

  // simulate a right mouse down on the second cell
  comp._onMousedown(new DOMEvent({ target: secondCellComp.getNativeElement(), which: 3 }))
  sel = editorSession.getSelection()
  t.comment('A right-click on the second cell ...')
  t.equal(sel.customType, 'table', 'the table should be selected,')
  t.equal(sel.data.anchorCellId, secondCell.id, '.. with anchor on second cell,')
  t.equal(sel.data.focusCellId, secondCell.id, '.. and focus on second cell,')

  t.end()
})

test('Table: navigating cells with keyboard', t => {
  let { editorSession, table, context } = _setupEditorWithOneTable(t)
  let el = getMountPoint(t)
  let comp = new TableComponent(null, { node: table }, { context })
  comp.mount(el)
  let matrix = table.getCellMatrix()
  let cellB1 = matrix[0][1]
  let cellA2 = matrix[1][0]
  let cellB2 = matrix[1][1]
  let cellB2Comp = comp.refs[cellB2.id]
  let sel

  // simulate a mouse down on the first cell
  comp._onMousedown(new DOMEvent({ target: cellB2Comp.getNativeElement() }))

  // simulate LEFT key
  comp._onKeydown(new DOMEvent(LEFT))
  sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'The table should be selected,')
  t.equal(sel.data.anchorCellId, cellA2.id, '.. with anchor on A2,')
  t.equal(sel.data.focusCellId, cellA2.id, '.. and focus on A2,')

  // simulate RIGHT key
  comp._onKeydown(new DOMEvent(RIGHT))
  sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'The table should be selected,')
  t.equal(sel.data.anchorCellId, cellB2.id, '.. with anchor on B2,')
  t.equal(sel.data.focusCellId, cellB2.id, '.. and focus on B2,')

  // simulate UP key
  comp._onKeydown(new DOMEvent(UP))
  sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'The table should be selected,')
  t.equal(sel.data.anchorCellId, cellB1.id, '.. with anchor on B1,')
  t.equal(sel.data.focusCellId, cellB1.id, '.. and focus on B1,')

  // simulate DOWN key
  comp._onKeydown(new DOMEvent(DOWN))
  sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'The table should be selected,')
  t.equal(sel.data.anchorCellId, cellB2.id, '.. with anchor on B2,')
  t.equal(sel.data.focusCellId, cellB2.id, '.. and focus on B2,')

  t.end()
})

test('Table: double clicking a cell', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  let cell = _selectCell(tableComp, 1, 0)
  cell.el.emit('dblclick', {})
  let surface = cell.find('.sc-surface')
  let sel = getSelection(editor)
  t.deepEqual({
    type: sel.type,
    path: sel.path,
    surfaceId: sel.surfaceId
  }, {
    type: 'property',
    path: cell.props.node.getPath(),
    surfaceId: surface.getId()
  }, 'selection should be inside cell')
  t.end()
})

test('Table: ENTER a cell', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  let cell = _selectCell(tableComp, 1, 0)
  tableComp._onKeydown(new DOMEvent(ENTER))
  let surface = cell.find('.sc-surface')
  let sel = getSelection(editor)
  t.deepEqual({
    type: sel.type,
    path: sel.path,
    surfaceId: sel.surfaceId
  }, {
    type: 'property',
    path: cell.props.node.getPath(),
    surfaceId: surface.getId()
  }, 'selection should be inside cell')
  t.end()
})

test('Table: leaving a cell with ENTER', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  let table = _getTable(tableComp)
  let cell = table.getCell(0, 0)

  setCursor(editor, cell.getPath(), 0)
  let cellComp = _getCellComponentById(tableComp, cell.id)
  let cellEditor = cellComp.find('.sc-table-cell-editor')
  cellEditor.onKeyDown(_createSurfaceEvent(cellEditor, ENTER))
  let sel = getSelection(editor)
  let expectedCellId = table.getCell(1, 0).id
  t.deepEqual({
    customType: sel.customType,
    anchorCellId: sel.data.anchorCellId,
    focusCellId: sel.data.focusCellId
  }, {
    customType: 'table',
    anchorCellId: expectedCellId,
    focusCellId: expectedCellId
  }, 'next cell should be selected')
  t.end()
})

test('Table: TAB on a cell', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  let matrix = _getTable(tableComp).getCellMatrix()
  // select B2
  _selectCell(tableComp, 1, 1)
  // TAB should move the selection on cell to the right
  tableComp._onKeydown(new DOMEvent(TAB))
  let expectedCellId = matrix[1][2].id
  let sel = getSelection(editor)
  t.deepEqual({
    customType: sel.customType,
    anchorCellId: sel.data.anchorCellId,
    focusCellId: sel.data.focusCellId
  }, {
    customType: 'table',
    anchorCellId: expectedCellId,
    focusCellId: expectedCellId
  }, 'next cell should be selected')
  t.end()
})

test('Table: leaving a cell with TAB', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  let table = _getTable(tableComp)
  let cell = table.getCell(0, 0)

  setCursor(editor, cell.getPath(), 0)
  let cellComp = _getCellComponentById(tableComp, cell.id)
  let cellEditor = cellComp.find('.sc-table-cell-editor')
  cellEditor.onKeyDown(_createSurfaceEvent(cellEditor, TAB))
  let sel = getSelection(editor)
  let expectedCellId = table.getCell(0, 1).id
  t.deepEqual({
    customType: sel.customType,
    anchorCellId: sel.data.anchorCellId,
    focusCellId: sel.data.focusCellId
  }, {
    customType: 'table',
    anchorCellId: expectedCellId,
    focusCellId: expectedCellId
  }, 'next cell should be selected')
  t.end()
})

test('Table: DELETE a cell', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  let matrix = _getTable(tableComp).getCellMatrix()

  // deleteting via DELETE
  // select B2
  _selectCell(tableComp, 1, 1)
  // TAB should move the selection on cell to the right
  tableComp._onKeydown(new DOMEvent(DELETE))
  t.ok(matrix[1][1].isEmpty(), 'cell content should have been deleted')

  // deleteting via BACKSPACE
  // select B3
  _selectCell(tableComp, 2, 1)
  // TAB should move the selection on cell to the right
  tableComp._onKeydown(new DOMEvent(BACKSPACE))
  t.ok(matrix[2][1].isEmpty(), 'cell content should have been deleted')

  t.end()
})

test('Table: ESCAPE from a cell', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  let matrix = _getTable(tableComp).getCellMatrix()
  setCursor(editor, matrix[1][0].getPath(), 0)
  let cell = _getCellComponent(tableComp, 1, 0)
  let cellEditor = cell.find('.sc-table-cell-editor')
  cellEditor.onKeyDown(_createSurfaceEvent(cellEditor, ESCAPE))
  let sel = getSelection(editor)
  let expectedCellId = matrix[1][0].id
  t.deepEqual({
    customType: sel.customType,
    anchorCellId: sel.data.anchorCellId,
    focusCellId: sel.data.focusCellId
  }, {
    customType: 'table',
    anchorCellId: expectedCellId,
    focusCellId: expectedCellId
  }, 'cell should be selected')
  t.end()
})

test('Table: typing over a cell', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  let cellComp = _selectCell(tableComp, 1, 0)
  let cell = cellComp.props.node
  tableComp.refs.keytrap.val('foo')
  tableComp._onInput(new DOMEvent())
  let sel = getSelection(editor)
  let surface = cellComp.find('.sc-surface')
  t.equal(cell.content, 'foo', 'cell content should have been overwritten')
  t.deepEqual({
    type: sel.type,
    path: sel.path,
    offset: sel.startOffset,
    surfaceId: sel.surfaceId
  }, {
    type: 'property',
    path: cell.getPath(),
    offset: cell.content.length,
    surfaceId: surface.getId()
  }, "cursor should be at the end of the cell's content")
  t.end()
})

test('Table: inserting line break in a cell', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  let table = _getTable(tableComp)
  let cell = table.getCell(0, 0)
  cell.content = 'xxx'
  setCursor(editor, cell.getPath(), 1)
  let cellComp = _getCellComponentById(tableComp, cell.id)
  let cellEditor = cellComp.find('.sc-table-cell-editor')
  cellEditor.onKeyDown(_createSurfaceEvent(cellEditor, SHIFT_ENTER))
  t.equal(cell.content, 'x\nxx', 'a line break should have been inserted')
  t.end()
})

test('Table: formatting in table cells', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  loadBodyFixture(editor, SIMPLE_TABLE)

  // use bold tool
  setSelection(editor, 't11.content', 1, 2)
  annotate(editor, 'bold')
  let annos = doc.getAnnotations(['t11', 'content'])
  t.deepEqual(annos.map(a => a.type), ['bold'], 'there should be one bold annotation on t11')

  // use italic tool
  setSelection(editor, 't12.content', 1, 2)
  annotate(editor, 'italic')
  annos = doc.getAnnotations(['t12', 'content'])
  t.deepEqual(annos.map(a => a.type), ['italic'], 'there should be one italic annotation on t12')

  // use sup tool
  setSelection(editor, 't13.content', 1, 2)
  annotate(editor, 'superscript')
  annos = doc.getAnnotations(['t13', 'content'])
  t.deepEqual(annos.map(a => a.type), ['superscript'], 'there should be one sup annotation on t13')

  // use sub tool
  setSelection(editor, 't21.content', 1, 2)
  annotate(editor, 'subscript')
  annos = doc.getAnnotations(['t21', 'content'])
  t.deepEqual(annos.map(a => a.type), ['subscript'], 'there should be one sub annotation on t21')

  // use monospace tool
  setSelection(editor, 't22.content', 1, 2)
  annotate(editor, 'monospace')
  annos = doc.getAnnotations(['t22', 'content'])
  t.deepEqual(annos.map(a => a.type), ['monospace'], 'there should be one monospace annotation on t22')

  t.end()
})

const TABLES_AND_REFS = `<p />
<p id="p1">Foo Bar <xref ref-type="table" rid="t1"></xref></p>
<table-wrap id="t1">
<table />
</table-wrap>
<p id="p2">Lorem ipsum <xref ref-type="table" rid="t2"></xref></p>
<table-wrap id="t2">
<table />
</table-wrap>
<p>Bla bla</p>`

// testing the general ability to insert tables but also look into table citations
test('Table: automatic updates of table and table-reference labels', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let api = getApi(editor)
  let doc = getDocument(editor)
  loadBodyFixture(editor, TABLES_AND_REFS)

  let t1 = doc.get('t1')
  t.equal(t1.state.label, 'Table 1', 't1 should have correct label')
  let t2 = doc.get('t2')
  t.equal(t2.state.label, 'Table 2', 't2 should have correct label')

  let p1 = doc.get('p1')
  let t1ref = p1.find('xref')
  t.equal(t1ref.state.label, 'Table 1', 'citation of t1 should have correct label')
  let p2 = doc.get('p2')
  let t2ref = p2.find('xref')
  t.equal(t2ref.state.label, 'Table 2', 'citation of t2 should have correct label')

  selectNode(editor, 't1')
  api.deleteSelection()

  t.equal(t2.state.label, 'Table 1', 'citation of t2 should have correct label')
  t1ref = p1.find('xref')
  t.equal(t1ref.state.label, '???', 'citation of t1 should have correct label')
  t2ref = p2.find('xref')
  t.equal(t2ref.state.label, 'Table 1', 'citation of t2 should have correct label')

  // now assing the broken xref to t2
  let t1refComp = editor.find(`[data-id="${t1ref.id}"]`)
  t1refComp.el.click()

  let option = editor.find('.sc-edit-xref-tool .se-option')
  option.el.click()

  t1ref = p1.find('xref')
  t.equal(t1ref.state.label, 'Table 1', 'citation should now point to t2')

  t.end()
})

test('Table: table context menu', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  _selectCell(tableComp)
  let contextMenu = _openContextMenu(tableComp)
  t.ok(contextMenu && contextMenu.css('display', 'block'), 'context menu should be visible')
  t.ok(contextMenu.findAll('.sc-menu-item').length > 0, '.. and should not be empty')
  t.end()
})

test('Table: insert rows', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  const originalRowCount = _getRowCount(tableComp)

  t.comment('insert a row above')
  _selectCell(tableComp, 1, 0)
  let contextMenu = _openContextMenu(tableComp)
  contextMenu.find('.sm-insert-rows-above').click()
  t.equal(_getRowCount(tableComp), originalRowCount + 1, 'there should be one new row')
  // TODO: can we check that the row was inserted above?
  t.comment('undo')
  clickUndo(editor)
  t.equal(_getRowCount(tableComp), originalRowCount, 'change should have been undone')

  t.comment('insert a row below')
  _selectCell(tableComp, 1, 0)
  contextMenu = _openContextMenu(tableComp)
  contextMenu.find('.sm-insert-rows-below').click()
  t.equal(_getRowCount(tableComp), originalRowCount + 1, 'there should be one new row')
  // TODO: can we check that the row was inserted below?
  t.comment('undo')
  clickUndo(editor)
  t.equal(_getRowCount(tableComp), originalRowCount, 'change should have been undone')

  t.comment('insert multiple rows above')
  _selectRange(tableComp, 1, 0, 2, 0)
  contextMenu.find('.sm-insert-rows-above').click()
  t.equal(_getRowCount(tableComp), originalRowCount + 2, 'there should be two more rows')
  // TODO: can we check that the row was inserted above?
  t.comment('undo')
  clickUndo(editor)
  t.equal(_getRowCount(tableComp), originalRowCount, 'change should have been undone')

  t.comment('insert multiple rows below')
  _selectRange(tableComp, 1, 0, 2, 0)
  contextMenu.find('.sm-insert-rows-below').click()
  t.equal(_getRowCount(tableComp), originalRowCount + 2, 'there should be two more rows')
  // TODO: can we check that the row was inserted below?
  t.comment('undo')
  clickUndo(editor)
  t.equal(_getRowCount(tableComp), originalRowCount, 'change should have been undone')

  t.end()
})

test('Table: insert columns', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  const originalRowCount = _getColumnCount(tableComp)

  t.comment('insert column left')
  _selectCell(tableComp, 1, 0)
  let contextMenu = _openContextMenu(tableComp)
  contextMenu.find('.sm-insert-columns-left').click()
  t.equal(_getColumnCount(tableComp), originalRowCount + 1, 'there should be one new col')
  // TODO: can we check that the col was inserted before?
  t.comment('undo')
  clickUndo(editor)
  t.equal(_getColumnCount(tableComp), originalRowCount, 'change should have been undone')

  t.comment('insert column right')
  _selectCell(tableComp, 1, 0)
  contextMenu = _openContextMenu(tableComp)
  contextMenu.find('.sm-insert-columns-right').click()
  t.equal(_getColumnCount(tableComp), originalRowCount + 1, 'there should be one new col')
  // TODO: can we check that the col was inserted after?
  t.comment('undo')
  clickUndo(editor)
  t.equal(_getColumnCount(tableComp), originalRowCount, 'change should have been undone')

  t.comment('insert multiple columns left')
  _selectRange(tableComp, 1, 0, 1, 1)
  contextMenu.find('.sm-insert-columns-left').click()
  t.equal(_getColumnCount(tableComp), originalRowCount + 2, 'there should be two more cols')
  // TODO: can we check that the cols were inserted before?
  t.comment('undo')
  clickUndo(editor)
  t.equal(_getColumnCount(tableComp), originalRowCount, 'change should have been undone')

  t.comment('insert multiple columns right')
  _selectRange(tableComp, 1, 0, 1, 1)
  contextMenu.find('.sm-insert-columns-right').click()
  t.equal(_getColumnCount(tableComp), originalRowCount + 2, 'there should be two more cols')
  // TODO: can we check that the cols were inserted after?
  t.comment('undo')
  clickUndo(editor)
  t.equal(_getColumnCount(tableComp), originalRowCount, 'change should have been undone')

  t.end()
})

test('Table: delete rows', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  let table = _getTable(tableComp)
  const originalRowCount = table.getRowCount()

  t.comment('delete single row')
  // delete single row
  _selectCell(tableComp, 1, 0)
  let contextMenu = _openContextMenu(tableComp)
  contextMenu.find('.sm-delete-rows').click()
  t.equal(table.getRowCount(), originalRowCount - 1, 'there should be one row less')
  // TODO: can we check that the correct row deleted?
  t.comment('undo')
  clickUndo(editor)
  t.equal(table.getRowCount(), originalRowCount, 'change should have been undone')

  t.comment('delete multiple rows')
  _selectRange(tableComp, 1, 0, 2, 0)
  contextMenu = _openContextMenu(tableComp)
  contextMenu.find('.sm-delete-rows').click()
  t.equal(_getRowCount(tableComp), originalRowCount - 2, 'there should be two rows less')
  t.comment('undo')
  clickUndo(editor)
  t.equal(_getRowCount(tableComp), originalRowCount, 'change should have been undone')

  t.end()
})

test('Table: delete columns', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  let table = _getTable(tableComp)
  const originalColCount = _getColumnCount(tableComp)

  t.comment('delete single col')
  _selectCell(tableComp, 1, 0)
  let contextMenu = _openContextMenu(tableComp)
  contextMenu.find('.sm-delete-columns').click()
  t.equal(_getColumnCount(tableComp), originalColCount - 1, 'there should be one col less')
  // TODO: can we check that the correct col deleted?
  t.comment('undo')
  clickUndo(editor)
  t.equal(table.getRowCount(), originalColCount, 'change should have been undone')

  t.comment('delete multiple cols')
  _selectRange(tableComp, 1, 0, 1, 1)
  contextMenu = _openContextMenu(tableComp)
  contextMenu.find('.sm-delete-columns').click()
  t.equal(_getColumnCount(tableComp), originalColCount - 2, 'there should be two cols less')
  t.comment('undo')
  clickUndo(editor)
  t.equal(table.getRowCount(), originalColCount, 'change should have been undone')

  t.end()
})

test('Table: cutting cells', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  let matrix = _getTable(tableComp).getCellMatrix()

  let cells, expectedContent, pasteEvent, dom, htmlTable, tds
  // single cell
  cells = _getCellRange(matrix, 0, 0, 0, 0)
  expectedContent = cells.map(cell => cell.getText())
  pasteEvent = new DOMEvent({ clipboardData: new ClipboardEventData() })
  t.comment('cutting a single cell')
  _selectCell(tableComp, 0, 0)
  tableComp._onCut(pasteEvent)
  t.ok(matrix[0][0].isEmpty(), 'cell should be empty')
  dom = DefaultDOMElement.parseHTML(pasteEvent.clipboardData.getData('text/html'))
  htmlTable = dom.find('table')
  t.notNil(htmlTable, 'there should be a <table> in the HTML')
  if (htmlTable) {
    t.equal(htmlTable.findAll('tr').length, 1, '.. with one <tr>')
    tds = htmlTable.findAll('td')
    t.equal(tds.length, 1, '.. and one <td>')
    t.deepEqual(tds.map(td => td.text()), expectedContent, '<td> should have correct content')
  }
  // cell range
  cells = _getCellRange(matrix, 1, 1, 2, 2)
  expectedContent = cells.map(cell => cell.getText())
  pasteEvent = new DOMEvent({ clipboardData: new ClipboardEventData() })
  t.comment('cutting a cell range')
  _selectRange(tableComp, 1, 1, 2, 2)
  tableComp._onCut(pasteEvent)
  t.ok(cells.every(cell => cell.isEmpty()), 'cells should be empty')
  dom = DefaultDOMElement.parseHTML(pasteEvent.clipboardData.getData('text/html'))
  htmlTable = dom.find('table')
  t.notNil(htmlTable, 'there should be a <table> in the HTML')
  if (htmlTable) {
    t.equal(htmlTable.findAll('tr').length, 2, '.. with two <tr>')
    let tds = htmlTable.findAll('td')
    t.equal(tds.length, 4, '.. and 4 <td>')
    t.deepEqual(tds.map(td => td.text()), expectedContent, '<td> should have correct content')
  }

  t.end()
})

test('Table: pasting cells', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  let matrix = _getTable(tableComp).getCellMatrix()

  let sourceCells, targetCells, expectedContent, pasteEvent
  // single cell
  sourceCells = _getCellRange(matrix, 0, 0, 0, 0)
  targetCells = _getCellRange(matrix, 1, 1, 1, 1)
  expectedContent = sourceCells.map(cell => cell.getText())
  pasteEvent = new DOMEvent({ clipboardData: new ClipboardEventData() })
  t.comment('pasting a single cell')
  _selectCell(tableComp, 0, 0)
  tableComp._onCopy(pasteEvent)
  _selectCell(tableComp, 1, 1)
  tableComp._onPaste(pasteEvent)
  t.deepEqual(targetCells.map(cell => cell.getText()), expectedContent, 'content should have been pasted')

  // cell range
  sourceCells = _getCellRange(matrix, 0, 0, 1, 1)
  targetCells = _getCellRange(matrix, 2, 2, 3, 3)
  expectedContent = sourceCells.map(cell => cell.getText())
  pasteEvent = new DOMEvent({ clipboardData: new ClipboardEventData() })
  t.comment('pasting a cell range')
  _selectRange(tableComp, 0, 0, 1, 1)
  tableComp._onCopy(pasteEvent)
  _selectCell(tableComp, 2, 2)
  tableComp._onPaste(pasteEvent)
  t.deepEqual(targetCells.map(cell => cell.getText()), expectedContent, 'content should have been pasted')

  t.end()
})

test('Table: pasting cells with automatic resize', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  let table = _getTable(tableComp)
  let [N, M] = table.getDimensions()
  let sourceCells, targetCells, expectedContent, pasteEvent
  sourceCells = _getCellRange(table.getCellMatrix(), 0, 0, 1, 2)
  expectedContent = sourceCells.map(cell => cell.getText())
  pasteEvent = new DOMEvent({ clipboardData: new ClipboardEventData() })
  _selectRange(tableComp, 0, 0, 1, 2)
  tableComp._onCopy(pasteEvent)
  _selectCell(tableComp, N - 1, M - 1)
  tableComp._onPaste(pasteEvent)
  t.deepEqual(table.getDimensions(), [N + 1, M + 2], 'table should have been resized')
  targetCells = _getCellRange(table.getCellMatrix(), N - 1, M - 1, N, M + 1)
  t.deepEqual(targetCells.map(cell => cell.getText()), expectedContent, 'content should have been pasted')
  t.end()
})

test('Table: merging cells', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, SIMPLE_TABLE)
  let tableComp = editor.find('.sc-table')
  let table = _getTable(tableComp)

  _selectRange(tableComp, 0, 0, 1, 1)
  let tool = openContextMenuAndFindTool(editor, '.sm-toggle-cell-merge')
  t.ok(tool.click(), 'using merge toggle should not throw')
  let cell = table.getCell(0, 0)
  t.deepEqual({ rowspan: cell.rowspan, colspan: cell.colspan }, { rowspan: 2, colspan: 2 }, 'cell should be spanning over two rows and two columns')
  let cellComp = _getCellComponent(tableComp, 0, 0)
  t.deepEqual({
    rowspan: cellComp.attr('rowspan'),
    colspan: cellComp.attr('colspan')
  },
  {
    rowspan: '2',
    colspan: '2'
  }, 'cell component should be rendered with row- and colspan')
  let sel = getSelection(editor)
  t.deepEqual({
    anchorCellId: sel.data.anchorCellId,
    focusCellId: sel.data.focusCellId
  },
  {
    anchorCellId: cell.id,
    focusCellId: cell.id
  }, 'cell should be selected')

  t.end()
})

test('Table: unmerging cells', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, TABLE_WITH_MERGED_CELLS)
  let tableComp = editor.find('.sc-table')
  let table = _getTable(tableComp)
  let doc = table.getDocument()

  _selectCellWithId(tableComp, 't23')
  let tool = openContextMenuAndFindTool(editor, '.sm-toggle-cell-merge')
  t.ok(tool.click(), 'using merge toggle should not throw')
  let cell = doc.get('t23')
  t.deepEqual({ rowspan: cell.rowspan, colspan: cell.colspan }, { rowspan: 1, colspan: 1 }, 'cell should not be spanning anymore')
  let cellComp = _getCellComponentById(tableComp, 't23')
  let lastCell = table.getCell(3, 3)
  t.ok([cellComp.attr('rowspan'), cellComp.attr('colspan')].every(isNil), 'cell component should be rendered without row- and colspan')
  let sel = getSelection(editor)
  t.deepEqual({
    anchorCellId: sel.data.anchorCellId,
    focusCellId: sel.data.focusCellId
  },
  {
    anchorCellId: cell.id,
    focusCellId: lastCell.id
  }, 'cell should be selected')

  t.end()
})

test('Table: toggle cell heading', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, TABLE_WITH_HEADINGS)
  let tableComp = editor.find('.sc-table')
  let table = _getTable(tableComp)
  let doc = table.getDocument()

  let cell = doc.get('t11')
  t.comment('initial cell is a heading')
  t.equal(cell.heading, true, 'cell should be heading initially')

  t.comment('toggling cell heading')
  _selectCellWithId(tableComp, 't11')
  let tool = openContextMenuAndFindTool(editor, '.sm-toggle-cell-heading')
  t.ok(tool.click(), 'using heading toggle should not throw')
  t.equal(cell.heading, false, 'cell should not be heading anymore')
  let cellComp = _getCellComponentById(tableComp, 't11')
  t.equal(cellComp.el.tagName, 'td', 'cell should be rendered as <td>')

  t.comment('toggling cell heading back')
  tool = openContextMenuAndFindTool(editor, '.sm-toggle-cell-heading')
  t.ok(tool.click(), 'using heading toggle should not throw')
  t.equal(cell.heading, true, 'cell should be heading again')
  cellComp = _getCellComponentById(tableComp, 't11')
  t.equal(cellComp.el.tagName, 'th', 'cell should be rendered as <th>')

  t.end()
})

// various tests for inserting annos or inline-nodes into a table cell
// TODO: this could be useful for all kinds of text properties with annos
// we should at least share the specs
const INLINE_NODE_TESTS = [
  {
    name: 'External Link',
    clickTool (editor) {
      return openMenuAndFindTool(editor, 'insert', '.sm-create-external-link').click()
    },
    nodeSelector: '.sc-external-link'
  },
  {
    name: 'Math',
    clickTool (editor) {
      return openMenuAndFindTool(editor, 'insert', '.sm-insert-inline-formula').click()
    },
    nodeSelector: '.sc-inline-formula',
    collapsed: true
  },
  {
    name: 'Inline Graphic',
    clickTool (editor) {
      let tool = openMenuAndFindTool(editor, 'insert', '.sc-insert-inline-graphic-tool')
      tool.onFileSelect(new PseudoFileEvent())
      return true
    },
    nodeSelector: '.sc-inline-graphic',
    collapsed: true
  },
  {
    name: 'Citation',
    clickTool (editor) {
      return openMenuAndFindTool(editor, 'insert', '.sm-insert-xref-bibr').click()
    },
    nodeSelector: '.sc-xref',
    collapsed: true
  },
  {
    name: 'Figure Reference',
    clickTool (editor) {
      return openMenuAndFindTool(editor, 'insert', '.sm-insert-xref-figure').click()
    },
    nodeSelector: '.sc-xref',
    collapsed: true
  },
  {
    name: 'Table Reference',
    clickTool (editor) {
      return openMenuAndFindTool(editor, 'insert', '.sm-insert-xref-table').click()
    },
    nodeSelector: '.sc-xref',
    collapsed: true
  },
  {
    name: 'Footnote Reference',
    clickTool (editor) {
      return openMenuAndFindTool(editor, 'insert', '.sm-insert-xref-footnote').click()
    },
    nodeSelector: '.sc-xref',
    collapsed: true
  },
  {
    name: 'Equation Reference',
    clickTool (editor) {
      return openMenuAndFindTool(editor, 'insert', '.sm-insert-xref-formula').click()
    },
    nodeSelector: '.sc-xref',
    collapsed: true
  },
  {
    name: 'File Reference',
    clickTool (editor) {
      return openMenuAndFindTool(editor, 'insert', '.sm-insert-xref-file').click()
    },
    nodeSelector: '.sc-xref',
    collapsed: true
  }
]
INLINE_NODE_TESTS.forEach(spec => {
  test(`Table: inserting a ${spec.name} into a table cell`, t => {
    let { app } = setupTestApp(t, { archiveId: 'blank' })
    let editor = openManuscriptEditor(app)
    loadBodyFixture(editor, SIMPLE_TABLE)
    let tableComp = editor.find('.sc-table')
    if (spec.collapsed) {
      setCursor(editor, 't21.content', 1)
    } else {
      setSelection(editor, 't21.content', 1, 2)
    }
    let cellComp = _getCellComponent(tableComp, 1, 0)
    t.ok(spec.clickTool(editor), 'clicking the insert tool should not throw')
    t.ok(Boolean(cellComp.find(spec.nodeSelector)), 'inline node should have been inserted')
    t.end()
  })
})

function _getCellComponent (tableComp, rowIdx, colIdx) {
  let rows = tableComp.findAll('tr')
  let cells = rows[rowIdx].findAll('td, th')
  return cells[colIdx]
}

function _getCellComponentById (tableComp, id) {
  return tableComp.find(`.sc-table-cell[data-id="${id}"]`)
}

function _selectCell (tableComp, rowIdx = 1, colIdx = 0) {
  let cell = _getCellComponent(tableComp, rowIdx, colIdx)
  tableComp._onMousedown(new DOMEvent({ target: cell.getNativeElement() }))
  cell.el.click()
  return cell
}

function _selectCellWithId (tableComp, id) {
  let cell = _getCellComponentById(tableComp, id)
  tableComp._onMousedown(new DOMEvent({ target: cell.getNativeElement() }))
  cell.el.click()
  return cell
}

function _selectRange (tableComp, startRowIdx, startColIdx, endRowIdx, endColIdx) {
  let rows = tableComp.findAll('tr')
  let startRow = rows[startRowIdx]
  let startCell = startRow.findAll('td, th')[startColIdx]
  let endRow = rows[endRowIdx]
  let endCell = endRow.findAll('td, th')[endColIdx]
  // HACK: using some private API here because I don't know how to emulate the
  // mouse-move selection gesture
  tableComp._requestSelectionChange(tableComp._createTableSelection({ anchorCellId: startCell.props.node.id, focusCellId: endCell.props.node.id }))
}

function _getTable (tableComp) {
  return tableComp.props.node
}

function _getRowCount (tableComp) {
  return _getTable(tableComp).getRowCount()
}

function _getColumnCount (tableComp) {
  return _getTable(tableComp).getColumnCount()
}

function _openContextMenu (tableComp) {
  tableComp._onContextMenu(new DOMEvent({ clientY: 0, clientX: 0 }))
  return tableComp.find('.sc-context-menu')
}

const TABLE_DATA = []
for (let i = 0, count = 1; i < 10; i++) {
  TABLE_DATA[i] = []
  for (let j = 0; j < 5; j++) {
    TABLE_DATA[i][j] = count++
  }
}

// TODO: set this up as integration test
// not unit testing the TableComponent testing the TableComponent used in the ManuscriptEditor
function _setupEditorWithOneTable (t) {
  let table
  let res = setupTestArticleSession({
    seed: doc => {
      table = tableHelpers.createTableFromTabularData(doc, TABLE_DATA, 't')
      doc.find('body').append(table)
    }
  })
  return {
    context: res.context,
    editorSession: res.editorSession,
    doc: res.doc,
    table
  }
}

function _getCellRange (matrix, startRow, startCol, endRow, endCol) {
  let range = getRangeFromMatrix(matrix, startRow, startCol, endRow, endCol)
  if (!isArray(range)) range = [range]
  else range = flattenOften(range, 2)
  return range
}

function _createSurfaceEvent (surface, eventData) {
  return new DOMEvent(Object.assign({ target: surface.getNativeElement() }, eventData))
}
