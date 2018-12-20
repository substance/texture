import { test } from 'substance-test'
import { setCursor, openManuscriptEditor, PseudoFileEvent, getEditorSession, loadBodyFixture, getDocument, setSelection } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

test('ManuscriptEditor: add inline graphic', t => {
  let { app } = setupTestApp(t)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 3)
  // Check that file-dialog does not throw
  let insertInlineGraphicTool = editor.find('.sc-insert-inline-graphic-tool')
  t.ok(insertInlineGraphicTool.find('button').click(), 'clicking on the insert inline graphic button should not throw error')
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

test('ManuscriptEditor: add inline formula', t => {
  let { app } = setupTestApp(t)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 5)

  // Open insert dropdown
  const insertDropdown = editor.find('.sc-tool-dropdown.sm-insert .sc-button')
  insertDropdown.click()

  let firstInlineNode = editor.find('[data-id=p-2] .sc-inline-node')
  t.notOk(firstInlineNode.hasClass('sm-inline-formula'), 'first inline node in p-2 paragraph should not be inline formula')
  let insertInlineFormulaTool = editor.find('.sc-menu-item.sm-insert-formula')
  t.ok(insertInlineFormulaTool.click(), 'clicking on the insert inline formula button should not throw error')
  let editorSession = getEditorSession(editor)
  editorSession.setSelection({
    type: 'property',
    path: ['p-2', 'content'],
    startOffset: 5,
    surfaceId: 'body'
  })
  let selectionState = editorSession.getSelectionState()
  let selectedInlineGraphics = selectionState.annosByType['inline-formula']
  t.equal(selectedInlineGraphics.length, 1, 'inline formula should be selected')
  t.end()
})

test('ManuscriptEditor: add disp formula', t => {
  let { app } = setupTestApp(t)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 5)

  // Open insert dropdown
  const insertDropdown = editor.find('.sc-tool-dropdown.sm-insert .sc-button')
  insertDropdown.click()

  let insertDispFormulaTool = editor.find('.sc-menu-item.sm-insert-disp-formula')
  t.ok(insertDispFormulaTool.click(), 'clicking on the insert disp formula button should not throw error')
  let afterP2 = editor.find('*[data-id=p-2] + *')
  t.ok(afterP2.hasClass('sm-disp-formula'), 'element after p-2 should be a disp formula now')
  // TODO: we should test the automatic labeling here as well
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

test('ManuscriptEditor: Switch paragraph to preformat', t => {
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
  let preformatButton = switchTypeDropdown.find('.sc-menu-item.sm-preformat')
  t.notNil(preformatButton, 'there should be an option to switch to preformat')
  preformatButton.click()
  let preformatEl = editor.find('.sc-surface.body > .sc-preformat')
  t.notNil(preformatEl, 'there should be a div with preformat component class now')
  t.end()
})

const SOME_PS = `<p id="p1">abcdef</p>
<p id="p2">ghijkl</p>
<p id="p3">mnopqr</p>
<p id="p4">stuvwx</p>`

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
