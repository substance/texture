import { test } from 'substance-test'
import { tableHelpers } from '../index'
import { DOMEvent } from './shared/testHelpers'
import { setCursor, openManuscriptEditor, PseudoFileEvent, getEditorSession, loadBodyFixture, getDocument, getApi, setSelection } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

test('ManuscriptEditor: add figure', t => {
  let { app } = setupTestApp(t)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 5)
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

test('ManuscriptEditor: add inline graphic', t => {
  let { app } = setupTestApp(t)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 3)
  // Check that file-dialog does not throw
  let insertInlineGraphicTool = editor.find('.sc-insert-inline-graphic-tool')
  t.ok(insertInlineGraphicTool.find('button').click(), 'clicking on the insert inline graphic button should not throw')
  let firstInlineNode = editor.find('[data-id=p-2] .sc-inline-node')
  t.notOk(firstInlineNode.hasClass('sm-inline-graphic'), 'first inline node in p-2 paragraph should not be inline graphic')
  // Trigger onFileSelect() directly
  insertInlineGraphicTool.onFileSelect(new PseudoFileEvent())
  firstInlineNode = editor.find('[data-id=p-2] .sc-inline-node')
  t.ok(firstInlineNode.hasClass('sm-inline-graphic'), 'first inline node in p-2 paragraph should be inline graphic')
  let editorSession = getEditorSession(editor)
  editorSession.setSelection({
    type: 'property',
    path: ['p-2', 'content'],
    startOffset: 3,
    surfaceId: 'body'
  })
  let selectionState = editorSession.getSelectionState()
  let selectedInlineGraphics = selectionState.annosByType['inline-graphic']
  t.equal(selectedInlineGraphics.length, 1, 'inline graphic should be selected')
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

const SOME_PS = `<p id="p1">abcdef</p>
<p id="p2">ghijkl</p>
<p id="p3">mnopqr</p>
<p id="p4">stuvwx</p>`

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

  // now assing the broken xref to t2
  let t1refComp = editor.find(`[data-id="${t1ref.id}"]`)
  t1refComp.el.click()

  let option = editor.find('.sc-edit-xref-tool .se-option')
  option.el.click()

  t1ref = p1.find('xref')
  t.equal(t1ref.state.label, 'Table 1', 'citation should now point to t2')

  t.end()
})

test('ManuscriptEditor: toggling a list', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  loadBodyFixture(editor, SOME_PS)

  let p1Text = doc.get(['p1', 'content'])

  setSelection(editor, 'p1.content', 0)
  let ulTool = editor.find('.sc-toggle-tool.sm-toggle-unordered-list')
  t.notNil(ulTool, 'the unordered-list tool should be visible')

  // click on list tool to turn "p1" into a list
  ulTool.find('button').el.click()
  let listNode = doc.get('body').getChildAt(0)
  t.equal(listNode.type, 'list', 'first node should now be a list')
  t.equal(listNode.getChildCount(), 1, '.. with one item')
  let listItem = listNode.getChildAt(0)
  t.equal(listItem.getText(), p1Text, '.. with the text of the former paragraph')

  // now there should be contextual list tools be visible
  t.notNil(editor.find('.sc-toggle-tool.sm-indent-list'), 'now there should be the indent tool be visible')
  t.notNil(editor.find('.sc-toggle-tool.sm-dedent-list'), '.. and the dedent tool')

  // click on list tool to turn it into a paragraph again
  editor.find('.sc-toggle-tool.sm-toggle-unordered-list > button').click()
  let pNode = doc.get('body').getChildAt(0)
  t.equal(pNode.type, 'p', 'first node should now be a paragraph again')

  t.end()
})
