import { test } from 'substance-test'
import { setCursor, openManuscriptEditor, PseudoFileEvent, getEditorSession, loadBodyFixture, getDocument, setSelection, LOREM_IPSUM, openMenuAndFindTool, clickUndo, isToolEnabled, createKeyEvent } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'
import { doesNotThrowInNodejs } from './shared/testHelpers'

// TODO: test editing of supplementary file description
// TODO: test open link in EditExtLinkTool
// TODO: test IncreaseHeadingLevel
// TODO: test save button
// TODO: find out why Footnote.getTemplate() is not covered -> insert footnote?
// TODO: test changin level of list item
// TODO: BreakComponent not used
// TODO: test error case for loading in GraphicComponent and InlineGraphicCOmponent
// TODO: test automatic label generation for block-formulas

const EMPTY_P = `<p id="p1"></p>`

test('ManuscriptEditor: add inline graphic', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 3)
  let insertInlineGraphicTool = openMenuAndFindTool(editor, 'insert', '.sc-insert-inline-graphic-tool')
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
  let insertInlineFormulaTool = openMenuAndFindTool(editor, 'insert', '.sc-menu-item.sm-insert-inline-formula')
  t.ok(insertInlineFormulaTool.click(), 'clicking on the insert inline formula button should not throw error')
  let inlineFormula = editor.find('[data-id=p-2] .sc-inline-node.sm-inline-formula')
  t.notNil(inlineFormula, 'there should be an inline-formula now')
  t.end()
})

const PARAGRAPH_WITH_INLINE_FORMULA = `<p id="p1">abc <inline-formula id="if-1" content-type="math/tex"><tex-math><![CDATA[\\sqrt(13)]]></tex-math></inline-formula> def</p>`

test('ManuscriptEditor: edit inline formula', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  const formulaContent = '\\sqrt(13)'
  const changedFormulaContent = '\\sqrt(14)'
  const getFormulaInput = () => editor.find('.sc-edit-math-tool .sc-input')
  loadBodyFixture(editor, PARAGRAPH_WITH_INLINE_FORMULA)
  // Set selection to open prompt editor
  setSelection(editor, 'p1.content', 4, 5)
  const formulaInput = getFormulaInput()
  t.notNil(formulaInput, 'there should be a math input inside popup')
  t.equal(formulaInput.val(), formulaContent, 'should equal to: ' + formulaContent)
  // Change the value
  formulaInput.val(changedFormulaContent)
  formulaInput._onChange()
  // Change selection to close editor
  setSelection(editor, 'p1.content', 2)
  t.isNil(getFormulaInput(), 'there should be no math input now')
  let inlineFormulaNode = doc.get('if-1')
  t.equal(inlineFormulaNode.content, changedFormulaContent, 'should equal to: ' + changedFormulaContent)
  t.end()
})

test('ManuscriptEditor: add block formula', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 5)
  let insertDispFormulaTool = openMenuAndFindTool(editor, 'insert', '.sc-menu-item.sm-insert-block-formula')
  t.ok(insertDispFormulaTool.click(), 'clicking on the insert disp formula button should not throw error')
  let blockFormula = editor.find('*[data-id=p-2] + .sm-block-formula')
  t.notNil(blockFormula, 'there should be a block-formula now')
  t.end()
})

const PARAGRAPH_AND_BLOCK_FORMULA = `<p id="p1">abcdef</p>
<disp-formula id="df-1" content-type="math/tex">
  <label>(1)</label>
  <tex-math><![CDATA[\\sqrt(13)]]></tex-math>
</disp-formula>
`

test('ManuscriptEditor: edit block formula', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  let editorSession = getEditorSession(editor)
  const formulaContent = '\\sqrt(13)'
  const formulaContentV2 = '\\sqrt(14)'
  const formulaContentV3 = '\\sqrt(14)'
  const selectFormula = () => {
    editorSession.setSelection({
      type: 'node',
      nodeId: 'df-1',
      surfaceId: 'body',
      containerPath: ['body', 'content']
    })
  }
  const getFormulaInput = () => editor.find('.sc-edit-math-tool .sc-text-area')
  loadBodyFixture(editor, PARAGRAPH_AND_BLOCK_FORMULA)
  // Set selection to open prompt editor
  selectFormula()
  let formulaInput = getFormulaInput()
  t.notNil(formulaInput, 'there should be an input inside popup')
  t.equal(formulaInput.val(), formulaContent, 'input should show formula')
  // Change the value
  formulaInput.val(formulaContentV2)
  formulaInput._onChange()
  // Change selection to close editor
  setSelection(editor, 'p1.content', 2)
  t.isNil(getFormulaInput(), 'there should be no math input now')
  let blockFormulaNode = doc.get('df-1')
  t.equal(blockFormulaNode.content, formulaContentV2, 'formula should have been updated')
  // Submitting a change via CommandOrControl+Enter
  selectFormula()
  formulaInput = getFormulaInput()
  formulaInput.val(formulaContentV3)
  formulaInput.emit('keyevent', createKeyEvent('CommandOrControl+Enter'))
  t.equal(blockFormulaNode.content, formulaContentV3, 'formula should have been updated')
  t.end()
})

test('ManuscriptEditor: add block quote', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 5)
  let insertBlockQuoteTool = openMenuAndFindTool(editor, 'insert', '.sc-menu-item.sm-insert-block-quote')
  t.ok(insertBlockQuoteTool.click(), 'clicking on the insert block quote button should not throw error')
  let blockQuote = editor.find('*[data-id=p-2] + .sm-block-quote')
  t.notNil(blockQuote, 'there should be a block quote now')
  t.end()
})

test('ManuscriptEditor: TOC dynamic sections appear only if content is not empty', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, ONE_PARAGRAPH)
  const footnotesTOCSectionSelector = '.se-toc-entries [data-id="footnotes"]'
  const getFootnotesTocSection = () => editor.find(footnotesTOCSectionSelector)
  t.ok(getFootnotesTocSection().hasClass('sm-hidden'), 'footnotes entry should be hidden')
  // click on insert footnote tool
  const insertFootnoteTool = openMenuAndFindTool(editor, 'insert', '.sm-insert-footnote')
  insertFootnoteTool.click()
  t.notOk(getFootnotesTocSection().hasClass('sm-hidden'), 'footnotes entry should be visible')
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

test('ManuscriptEditor: all TOC items should be clickable', t => {
  let { app } = setupTestApp(t, { archiveId: 'kitchen-sink' })
  let editor = openManuscriptEditor(app)
  const tocItemSelector = '.se-toc-entries a'
  const tocItems = editor.findAll(tocItemSelector)
  tocItems.forEach(item => {
    t.ok(item.click(), 'clicking on TOC item should not throw: ' + item.textContent)
  })
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
  // click on list tool to turn "p1" into a list
  let ulTool = openMenuAndFindTool(editor, 'text-types', '.sm-create-unordered-list')
  t.ok(ulTool, 'the unordered-list tool should be visible')
  ulTool.click()
  let listNode = doc.get('body').getNodeAt(0)
  t.equal(listNode.type, 'list', 'first node should now be a list')
  t.equal(listNode.items.length, 1, '.. with one item')
  let listItem = listNode.getItemAt(0)
  t.equal(listItem.getText(), p1Text, '.. with the text of the former paragraph')

  // now there should be contextual list tools be visible
  t.ok(openMenuAndFindTool(editor, 'list-tools', '.sm-indent-list'), 'now there should be the indent tool be visible')
  t.ok(openMenuAndFindTool(editor, 'list-tools', '.sm-dedent-list'), '.. and the dedent tool')

  // click on list tool to turn it into a paragraph again
  openMenuAndFindTool(editor, 'list-tools', '.sm-toggle-unordered-list').click()

  let pNode = doc.get('body').getNodeAt(0)
  t.equal(pNode.type, 'paragraph', 'first node should now be a paragraph again')

  t.end()
})

const LIST = `
<list list-type="bullet" id="list-1">
  <list-item id="li1">
    <p>Item 1</p>
    <list list-type="order">
      <list-item id="li1_1">
        <p>Item 2</p>
      </list-item>
      <list-item>
        <p>Item 3</p>
      </list-item>
    </list>
  </list-item>
  <list-item>
    <p>Item 4</p>
    <list list-type="order">
      <list-item>
        <p>Item 5</p>
      </list-item>
      <list-item>
        <p>Item 6</p>
        <list list-type="bullet">
          <list-item>
            <p>Item 7</p>
          </list-item>
          <list-item>
            <p>Item 8</p>
          </list-item>
        </list>
      </list-item>
    </list>
  </list-item>
  <list-item>
    <p>Item 9</p>
  </list-item>
</list>
`

test('ManuscriptEditor: changing the list style', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  loadBodyFixture(editor, LIST)

  setSelection(editor, 'li1.content', 0)
  // click on list tool to turn "p1" into a list
  let ulTool = openMenuAndFindTool(editor, 'list-tools', '.sm-toggle-ordered-list')
  ulTool.click()
  let listNode = doc.get('list-1')
  t.equal(listNode.listType, 'order,order,bullet', 'all levels should be ordered')

  setSelection(editor, 'li1_1.content', 0)
  let olTool = openMenuAndFindTool(editor, 'list-tools', '.sm-toggle-unordered-list')
  olTool.click()
  t.equal(listNode.listType, 'order,bullet,bullet', 'all levels should be ordered')

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

test('ManuscriptEditor: inserting a table figure', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, EMPTY_P)
  setCursor(editor, 'p1.content', 0)

  let tool = openMenuAndFindTool(editor, 'insert', '.sc-insert-table-tool')
  t.ok(tool.click(), 'using the insert table tool should not throw')
  let tableFigure = editor.find('.sc-table-figure')
  t.notNil(tableFigure, 'a table figure should be visible')
  // the legend should not be empty, otherwise not editable
  let legendEditor = tableFigure.find('.sc-container-editor.se-legend')
  t.notNil(legendEditor, 'the legend should be editable')
  t.notNil(legendEditor.find('.sc-paragraph'), 'there should be a paragraph inside the legend editor')
  t.end()
})

const SPECS = [
  {
    'type': 'block-formula',
    'tool': '.sc-menu-item.sm-insert-block-formula',
    'label': 'Formula'
  },
  {
    'type': 'block-quote',
    'tool': '.sc-menu-item.sm-insert-block-quote',
    'label': 'Blockquote'
  },
  {
    'type': 'table-figure',
    'tool': '.sc-insert-table-tool',
    'label': 'Table'
  }
]
SPECS.forEach(spec => {
  // TODO: explain why this test was added? Is it about general insertion of certain nodes?
  test(`ManuscriptEditor: inserting a '${spec.label}' into an empty document`, t => {
    testEmptyBodyIsolationNodeInsertion(t, spec)
  })
})

function testEmptyBodyIsolationNodeInsertion (t, spec) {
  // TODO: the tests/checks could be more targeted. We should not check for everything everywhere.
  // A test should focus on a certain aspect and test only that.
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)

  const _canInsert = () => isToolEnabled(editor, 'insert', spec.tool)
  const _insert = () => openMenuAndFindTool(editor, 'insert', spec.tool).click()
  const _getFirstElement = () => doc.get('body').getNodeAt(0)

  loadBodyFixture(editor, EMPTY_P)

  t.notOk(_canInsert(), 'insert should be disabled wihtout selection')
  setCursor(editor, 'p1.content', 0)
  t.ok(_canInsert(), 'insert should be enabled')
  _insert()
  t.equal(_getFirstElement().type, spec.type, 'element should be ' + spec.type)
  doesNotThrowInNodejs(t, () => {
    clickUndo(editor)
  }, 'undoing should not throw')
  t.end()
}
