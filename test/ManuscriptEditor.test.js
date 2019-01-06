import { test } from 'substance-test'
import { setCursor, openManuscriptEditor, PseudoFileEvent, getEditorSession, loadBodyFixture, getDocument, setSelection, LOREM_IPSUM } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

// TODO: add a test demonstrating that the TOC is working as expected
// TODO: test editing of block-quote
// TODO: test editing of inline-formula
// TODO: test editing of block-formula
// TODO: test editing of supplementary file description
// TODO: test open link in EditExtLinkTool
// TODO: test IncreaseHeadingLevel
// TODO: test insert table
// TODO: test key-handling of table cell editor
// TODO: test key-handling of table component
// TODO: test TableEditing
// TODO: test save button
// TODO: find out why Footnote.getTemplate() is not covered -> insert footnote?
// TODO: test changin level of list item
// TODO: find out why TableRow.getCellAt is not covered (isn't it used in TableEditing, and table editing is covered?)
// TODO: BreakComponent not used
// TODO: error case for GraphicComponent and InlineGraphicCOmponent not tested

test('ManuscriptEditor: add inline graphic', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 3)
  let insertInlineGraphicTool = editor.find('.sc-insert-inline-graphic-tool')
  // Trigger onFileSelect() directly
  insertInlineGraphicTool.onFileSelect(new PseudoFileEvent())
  let inlineGraphic = editor.find('[data-id=p-2] .sc-inline-node.sm-inline-graphic')
  t.notNil(inlineGraphic, 'there should be an inline-graphic now')
  t.end()
})

test('ManuscriptEditor: add inline formula', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 3)
  // Open insert dropdown
  const insertDropdown = editor.find('.sc-tool-dropdown.sm-insert .sc-button')
  insertDropdown.click()
  let insertInlineFormulaTool = editor.find('.sc-menu-item.sm-insert-formula')
  t.ok(insertInlineFormulaTool.click(), 'clicking on the insert inline formula button should not throw error')
  let inlineFormula = editor.find('[data-id=p-2] .sc-inline-node.sm-inline-formula')
  t.notNil(inlineFormula, 'there should be an inline-formula now')
  t.end()
})

test('ManuscriptEditor: add block formula', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 5)
  // Open insert dropdown
  const insertDropdown = editor.find('.sc-tool-dropdown.sm-insert .sc-button')
  insertDropdown.click()
  let insertDispFormulaTool = editor.find('.sc-menu-item.sm-insert-disp-formula')
  t.ok(insertDispFormulaTool.click(), 'clicking on the insert disp formula button should not throw error')
  let blockFormula = editor.find('*[data-id=p-2] + .sm-block-formula')
  t.notNil(blockFormula, 'there should be a block-formula now')
  // TODO: we should test automatic labeling
  t.end()
})

test('ManuscriptEditor: TOC should be updated on change', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
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

const ONE_PARAGRAPH = '<p id="p1">ABC</p>'

test('ManuscriptEditor: Switch paragraph to heading', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, ONE_PARAGRAPH)
  setCursor(editor, 'p1.content', 0)
  // open the switch type dropdown
  let switchTypeDropdown = editor.find('.sc-tool-dropdown.sm-text-types')
  switchTypeDropdown.find('button').click()
  let h1button = switchTypeDropdown.find('.sc-menu-item.sm-heading1')
  t.notNil(h1button, 'there should be an option to switch to heading level 1')
  h1button.click()
  // ATTENTION: we do not change id, which might be confusing for others
  let h1El = editor.find('.sc-surface.sm-body > h1')
  t.notNil(h1El, 'there should be a <h1> element now')
  t.end()
})

test('ManuscriptEditor: Switch paragraph to preformat', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, ONE_PARAGRAPH)
  setCursor(editor, 'p1.content', 0)
  // open the switch type dropdown
  let switchTypeDropdown = editor.find('.sc-tool-dropdown.sm-text-types')
  switchTypeDropdown.find('button').click()
  let preformatButton = switchTypeDropdown.find('.sc-menu-item.sm-preformat')
  t.notNil(preformatButton, 'there should be an option to switch to preformat')
  preformatButton.click()
  let preformatEl = editor.find('.sc-surface.sm-body > .sc-text-node.sm-preformat')
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
  let ulTool = _openMenuAndFindTool(editor, 'text-types', 'sm-create-unordered-list')
  t.ok(ulTool, 'the unordered-list tool should be visible')

  // click on list tool to turn "p1" into a list
  ulTool.find('button').el.click()
  let listNode = doc.get('body').getNodeAt(0)
  t.equal(listNode.type, 'list', 'first node should now be a list')
  t.equal(listNode.items.length, 1, '.. with one item')
  let listItem = listNode.getItemAt(0)
  t.equal(listItem.getText(), p1Text, '.. with the text of the former paragraph')

  // now there should be contextual list tools be visible
  t.ok(_openMenuAndFindTool(editor, 'list-tools', 'sm-indent-list'), 'now there should be the indent tool be visible')
  t.ok(_openMenuAndFindTool(editor, 'list-tools', 'sm-dedent-list'), '.. and the dedent tool')

  // click on list tool to turn it into a paragraph again
  editor.find('.sc-toggle-tool.sm-toggle-unordered-list > button').click()
  let pNode = doc.get('body').getNodeAt(0)
  t.equal(pNode.type, 'paragraph', 'first node should now be a paragraph again')

  t.end()
})

const P_WITH_EXTERNAL_LINK = `<p id="p1">This is a <ext-link xmlns:xlink="http://www.w3.org/1999/xlink" id="link" xlink:href="substance.io">link</ext-link></p>`

test('ManuscriptEditor: editing an external link', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  loadBodyFixture(editor, P_WITH_EXTERNAL_LINK)

  function _getUrlInput () { return editor.find('.sc-edit-external-link-tool > input') }
  function _getUrlInputValue () { return _getUrlInput().el.val() }
  function _setUrlInputValue (val) { return _getUrlInput().el.val(val) }

  let link = doc.get('link')
  setCursor(editor, 'p1.content', link.start.offset + 1)

  t.equal(_getUrlInputValue(), link.href, 'url input field should show current href value')
  _setUrlInputValue('foo')
  t.doesNotThrow(() => {
    _getUrlInput()._onChange()
  }, 'triggering href update should not throw')
  t.equal(link.href, 'foo', '.. and the link should have been updated')
  t.end()
})

function _openMenuAndFindTool (el, menuName, toolClass) {
  const menu = el.find(`.sc-tool-dropdown.sm-${menuName}`)
  if (menu.hasClass('sm-disabled')) return false
  const isActive = menu.find('button').hasClass('sm-active')
  if (!isActive) {
    menu.find('button').el.click()
  }
  return menu.find('button.' + toolClass)
}
