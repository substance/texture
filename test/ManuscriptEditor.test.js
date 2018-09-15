import { test } from 'substance-test'
import { tableHelpers } from '../index'
import { DOMEvent } from './shared/testHelpers'
import { setCursor, openManuscriptEditor, PseudoFileEvent, getEditorSession, loadBodyFixture, getDocument, getApi } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

test('ManuscriptEditor: add figure', t => {
  let { app } = setupTestApp(t)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 290)
  // ATTENTION: it is not possible to trigger the file-dialog programmatically
  // instead we are just checking that this does not throw
  let insertFigureTool = editor.find('.sc-insert-figure-tool')
  t.ok(insertFigureTool.find('button').click(), 'clicking on the insert figure button should not throw')
  // ... and then triggering onFileSelect() directly
  insertFigureTool.onFileSelect(new PseudoFileEvent())
  let afterP2 = editor.find('*[data-id=p-2] + *')
  t.ok(afterP2.hasClass('sm-figure'), 'element after p-2 should be a figure now')
  // TODO: we should test the automatic labeling
  t.end()
})

test('ManuscriptEditor: TOC should be updated on change', t => {
  let { app } = setupTestApp(t)
  let editor = openManuscriptEditor(app)
  let toc = editor.find('.sc-toc')
  let editorSession = getEditorSession(editor)
  editorSession.transaction(tx => {
    tx.set(['sec-1', 'content'], 'TEST')
  })
  let h1 = toc.find('*[data-id="sec-1"]')
  t.equal(h1.el.text(), 'TEST', 'TOC entry should have been updated')
  t.end()
})

test('ManuscriptEditor: Switch paragraph to heading', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let editorSession = getEditorSession(editor)
  editorSession.transaction(tx => {
    let body = tx.get('body')
    body.append(tx.create({
      type: 'p',
      id: 'p1'
    }))
  })
  setCursor(editor, 'p1.content', 0)
  // open the switch type dropdown
  let switchTypeDropdown = editor.find('.sc-tool-dropdown.sm-text-types')
  switchTypeDropdown.find('button').click()
  let h1button = switchTypeDropdown.find('.sc-menu-item.sm-heading1')
  t.notNil(h1button, 'there should be an option to switch to heading level 1')
  h1button.click()
  // ATTENTION: we do not change id, which might be confusing for others
  let h1El = editor.find('.sc-surface.body > h1')
  t.notNil(h1El, 'there should be a <h1> element now')
  t.end()
})

test('ManuscriptEditor: selecting a table', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let editorSession = getEditorSession(editor)
  editorSession.transaction(tx => {
    let body = tx.get('body')
    let table = tableHelpers.generateTable(tx, 10, 5, 'test-table')
    body.append(table)
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
test('ManuscriptEditor: inserting and deleting a table', t => {
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

  api._setSelection({
    type: 'node',
    nodeId: 't1',
    containerId: 'body'
  })
  api.deleteSelection()

  t.equal(t2.state.label, 'Table 1', 'citation of t2 should have correct label')
  t1ref = p1.find('xref')
  t.equal(t1ref.state.label, '???', 'citation of t1 should have correct label')
  t2ref = p2.find('xref')
  t.equal(t2ref.state.label, 'Table 1', 'citation of t2 should have correct label')

  t.end()
})
