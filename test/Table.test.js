import { keys } from 'substance'
import { test } from 'substance-test'
import {
  TableComponent, tableHelpers, TableEditing
} from '../index'
import { getMountPoint, DOMEvent } from './shared/testHelpers'
import setupTestArticleSession from './shared/setupTestArticleSession'
import {
  openManuscriptEditor, loadBodyFixture, getDocument, setSelection, getApi,
  getEditorSession, annotate
} from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

// TODO: add tests for table cells
// - add ext-link
// - cite figure
// - cite table
// - cite table-footnotes
// - cite reference

test('Table: mounting a table component', t => {
  let { table, context } = _setupEditorWithOneTable(t)
  let el = getMountPoint(t)
  let comp = new TableComponent(null, { node: table }, { context })
  comp.mount(el)
  t.notNil(el.find('.sc-table'), 'there should be a rendered table element')
  t.end()
})

test('Table: setting table selections', t => {
  let { editorSession, table, context } = _setupEditorWithOneTable(t)
  let el = getMountPoint(t)
  let comp = new TableComponent(null, { node: table }, { context })
  comp.mount(el)
  let matrix = table.getCellMatrix()
  let firstCell = matrix[0][0]
  let tableEditing = new TableEditing(editorSession, table.id, comp.getSurfaceId())
  // setting the selection on the first cell
  let sel = tableEditing.createTableSelection({
    anchorCellId: firstCell.id,
    focusCellId: firstCell.id
  })
  editorSession.setSelection(sel)
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
  comp._onMousedown(new DOMEvent({ target: firstCellComp.el }))
  comp._onMouseup(new DOMEvent({ target: firstCellComp.el }))

  let sel = editorSession.getSelection()
  t.ok(true, 'After a click on the firstCell')
  t.equal(sel.customType, 'table', '... the table should be selected,')
  t.equal(sel.data.anchorCellId, firstCell.id, '.. with anchor on first cell,')
  t.equal(sel.data.focusCellId, firstCell.id, '.. and focus on first cell,')

  // simulate a right mouse down on the second cell
  comp._onMousedown(new DOMEvent({ target: secondCellComp.el, which: 3 }))
  sel = editorSession.getSelection()
  t.ok(true, 'After a right-click on the secondCell')
  t.equal(sel.customType, 'table', 'The table should be selected,')
  t.equal(sel.data.anchorCellId, secondCell.id, '.. with anchor on second cell,')
  t.equal(sel.data.focusCellId, secondCell.id, '.. and focus on second cell,')

  t.end()
})

test('Table: keyboard interactions', t => {
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
  comp._onMousedown(new DOMEvent({ target: cellB2Comp.el }))

  // simulate LEFT key
  comp._onKeydown(new DOMEvent({ keyCode: keys.LEFT }))
  sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'The table should be selected,')
  t.equal(sel.data.anchorCellId, cellA2.id, '.. with anchor on A2,')
  t.equal(sel.data.focusCellId, cellA2.id, '.. and focus on A2,')

  // simulate RIGHT key
  comp._onKeydown(new DOMEvent({ keyCode: keys.RIGHT }))
  sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'The table should be selected,')
  t.equal(sel.data.anchorCellId, cellB2.id, '.. with anchor on B2,')
  t.equal(sel.data.focusCellId, cellB2.id, '.. and focus on B2,')

  // simulate UP key
  comp._onKeydown(new DOMEvent({ keyCode: keys.UP }))
  sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'The table should be selected,')
  t.equal(sel.data.anchorCellId, cellB1.id, '.. with anchor on B1,')
  t.equal(sel.data.focusCellId, cellB1.id, '.. and focus on B1,')

  // simulate DOWN key
  comp._onKeydown(new DOMEvent({ keyCode: keys.DOWN }))
  sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'The table should be selected,')
  t.equal(sel.data.anchorCellId, cellB2.id, '.. with anchor on B2,')
  t.equal(sel.data.focusCellId, cellB2.id, '.. and focus on B2,')

  t.end()
})

const SIMPLE_TABLE = `<table-wrap>
  <table>
    <tbody>
      <tr>
        <td id="t11">aaa</td>
        <td id="t12">bbb</td>
        <td id="t13">ccc</td>
      </tr>
      <tr>
        <td id="t21">ddd</td>
        <td id="t22">eee</td>
        <td id="t23">fff</td>
      </tr>
      <tr>
        <td id="t31">ggg</td>
        <td id="t32">hhh</td>
        <td id="t33">iii</td>
      </tr>
    </tbody>
  </table>
</table-wrap>`

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
test('Table: inserting and deleting a table into manuscript', t => {
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

  // TODO: use test helper
  api._setSelection({
    type: 'node',
    nodeId: 't1',
    containerPath: ['body', 'content']
  })
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
  table._onMousedown(new DOMEvent({ target: td.el }))

  td.el.click()
  sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'the selection should be a table selection')
  t.end()
})

function _setupEditorWithOneTable (t) {
  let table
  let res = setupTestArticleSession({
    seed: doc => {
      table = tableHelpers.generateTable(doc, 10, 5, 't')
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
