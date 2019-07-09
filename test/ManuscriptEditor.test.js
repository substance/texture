import { test } from 'substance-test'
import { parseKeyCombo } from 'substance'
import {
  setCursor, openManuscriptEditor, PseudoFileEvent, getEditorSession,
  loadBodyFixture, getDocument, setSelection, LOREM_IPSUM,
  openContextMenuAndFindTool, openMenuAndFindTool, clickUndo,
  isToolEnabled, selectNode, getSelection, selectRange,
  deleteSelection, createSurfaceEvent, canSwitchTextTypeTo, switchTextType, ensureValidJATS, insertText, executeCommand
} from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'
import { doesNotThrowInNodejs, DOMEvent, ClipboardEventData } from './shared/testHelpers'

// TODO: test open link in EditExtLinkTool
// TODO: test save button
// TODO: test error case for loading in GraphicComponent and InlineGraphicCOmponent
// TODO: test automatic label generation for block-formulas
// TODO: add a test using AddSupplementaryFileWorkflow

const EMPTY_P = `<p id="p1"></p>`

test('ManuscriptEditor: add inline graphic', t => {
  let { app, archive } = setupTestApp(t, LOREM_IPSUM)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 3)
  let insertInlineGraphicTool = openMenuAndFindTool(editor, 'insert', '.sc-insert-inline-graphic-tool')
  // Trigger onFileSelect() directly
  insertInlineGraphicTool.onFileSelect(new PseudoFileEvent('test.png'))
  let inlineGraphic = editor.find('[data-id=p-2] .sc-inline-node.sm-inline-graphic')
  t.notNil(inlineGraphic, 'there should be an inline-graphic now')
  ensureValidJATS(t, app)
  t.ok(archive.hasAsset('test.png'), 'the archive should contain the new asset')
  t.end()
})

test('ManuscriptEditor: add inline formula', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 3)
  let insertInlineFormulaTool = openMenuAndFindTool(editor, 'insert', '.sc-tool.sm-insert-inline-formula')
  t.ok(insertInlineFormulaTool.click(), 'clicking on the insert inline formula button should not throw error')
  let inlineFormula = editor.find('[data-id=p-2] .sc-inline-node.sm-inline-formula')
  t.notNil(inlineFormula, 'there should be an inline-formula now')
  t.end()
})

const PARAGRAPH_WITH_INLINE_FORMULA = `<p id="p1">abc <inline-formula id="if-1" content-type="math/tex"><tex-math><![CDATA[\\sqrt(13)]]></tex-math></inline-formula> def</p>`

test('ManuscriptEditor: edit inline formula', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, PARAGRAPH_WITH_INLINE_FORMULA)

  const getInlineFormulaEditor = () => editor.find('.sc-inline-formula-editor')

  let doc = getDocument(editor)
  let inlineFormulaNode = doc.get('if-1')
  let originalContent = inlineFormulaNode.content

  // Set selection to open prompt editor
  setSelection(editor, 'p1.content', 4, 5)
  t.ok(Boolean(getInlineFormulaEditor()), 'the inline formula editor should be shown')

  setCursor(editor, `${inlineFormulaNode.id}.content`, inlineFormulaNode.content.length)
  insertText(editor, '+1')
  t.equal(inlineFormulaNode.content, originalContent + '+1', 'content should have been updated')

  // setting the selection somewhere else should close the editor
  setSelection(editor, 'p1.content', 2)
  t.notOk(Boolean(getInlineFormulaEditor()), 'the inline formula editor should be hidden now')
  t.end()
})

test('ManuscriptEditor: add block formula', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 5)
  let insertDispFormulaTool = openMenuAndFindTool(editor, 'insert', '.sc-tool.sm-insert-block-formula')
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

test('ManuscriptEditor: edit a formula', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, PARAGRAPH_AND_BLOCK_FORMULA)

  const getFormulaComponent = () => editor.find('.sc-block-formula')
  const getFormulaEditor = () => editor.find('.sc-block-formula-editor')

  let doc = getDocument(editor)
  let node = doc.get('df-1')
  let originalContent = node.content
  let blockFormulaComp = getFormulaComponent()

  // Set selection to open prompt editor
  selectNode(editor, 'df-1')
  t.ok(Boolean(getFormulaEditor()), 'the formula editor should be shown')

  setCursor(editor, `${node.id}.content`, node.content.length)
  insertText(editor, '+1')
  t.equal(node.content, originalContent + '+1', 'content should have been updated')

  insertText(editor, '^')
  t.ok(blockFormulaComp.el.hasClass('sm-error'), 'formula should show an error now')

  // setting the selection somewhere else should close the editor
  setSelection(editor, 'p1.content', 2)
  t.notOk(Boolean(getFormulaEditor()), 'the formula editor should be hidden now')
  t.end()
})

test('ManuscriptEditor: add block quote', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-2.content', 5)
  let insertBlockQuoteTool = openMenuAndFindTool(editor, 'insert', '.sc-tool.sm-insert-block-quote')
  t.ok(insertBlockQuoteTool.click(), 'clicking on the insert block quote button should not throw error')
  let blockQuote = editor.find('*[data-id=p-2] + .sm-block-quote')
  t.notNil(blockQuote, 'there should be a block quote now')
  t.end()
})

test('ManuscriptEditor: TOC dynamic sections appear only if content is not empty', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, ONE_PARAGRAPH)
  const footnotesTOCSectionSelector = '.se-toc-entries [data-section="footnotes"]'
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
  const tocItemSelector = '.sc-toc-entry'
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

  t.ok(canSwitchTextTypeTo(editor, 'heading1'), 'switch to heading1 should be possible')
  switchTextType(editor, 'heading1')
  // ATTENTION: we do not change id, which might be confusing for others
  let h1El = editor.find('.sc-surface.sm-body > h1')
  t.notNil(h1El, 'there should be a <h1> element now')
  t.end()
})

test('ManuscriptEditor: Switch to heading', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  const _isHeadingDisplayed = (level) => {
    return Boolean(editor.find(`.sc-surface.sm-body > h${level}`))
  }
  loadBodyFixture(editor, ONE_PARAGRAPH)
  setCursor(editor, 'p1.content', 0)
  switchTextType(editor, 'heading1')
  t.ok(_isHeadingDisplayed(1), 'heading level 1 should be displayed')
  switchTextType(editor, 'heading2')
  t.ok(_isHeadingDisplayed(2), 'heading level 2 should be displayed')
  switchTextType(editor, 'heading3')
  t.ok(_isHeadingDisplayed(3), 'heading level 3 should be displayed')
  t.end()
})

const TAB = parseKeyCombo('Tab')
const SHIFT_TAB = parseKeyCombo('Shift+Tab')

test('ManuscriptEditor: increasing and decreasing heading level using TAB', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  loadBodyFixture(editor, ONE_PARAGRAPH)
  let bodySurface = _getBodySurface(editor)

  function _indent () {
    bodySurface.onKeyDown(createSurfaceEvent(bodySurface, TAB))
  }

  function _dedent () {
    bodySurface.onKeyDown(createSurfaceEvent(bodySurface, SHIFT_TAB))
  }

  setCursor(editor, 'p1.content', 0)
  switchTextType(editor, 'heading1')

  let heading = doc.get('body').getNodeAt(0)

  t.comment('increasing level')
  _indent()
  t.equal(heading.level, 2, 'heading level should have been increased')
  _indent()
  t.equal(heading.level, 3, 'heading level should have been increased')
  _indent()
  t.equal(heading.level, 3, 'heading level should not be increased higher than level 3')

  t.comment('decreasing level')
  _dedent()
  t.equal(heading.level, 2, 'heading level should have been decreased')
  _dedent()
  t.equal(heading.level, 1, 'heading level should have been decreased')
  _dedent()
  t.equal(heading.level, 1, 'heading level should no be decreased lower than level 1')

  t.end()
})

test('ManuscriptEditor: increasing and decreasing heading level via tool', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  loadBodyFixture(editor, ONE_PARAGRAPH)
  function _indent () {
    openMenuAndFindTool(editor, 'context-tools', '.sm-increase-heading-level').click()
  }
  function _dedent () {
    openMenuAndFindTool(editor, 'context-tools', '.sm-decrease-heading-level').click()
  }

  setCursor(editor, 'p1.content', 0)
  switchTextType(editor, 'heading1')
  let heading = doc.get('body').getNodeAt(0)
  t.comment('increasing level')
  _indent()
  t.equal(heading.level, 2, 'heading level should have been increased')
  _indent()
  t.equal(heading.level, 3, 'heading level should have been increased')

  t.comment('decreasing level')
  _dedent()
  t.equal(heading.level, 2, 'heading level should have been decreased')
  _dedent()
  t.equal(heading.level, 1, 'heading level should have been decreased')

  t.end()
})

test('ManuscriptEditor: Switch paragraph to preformat', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, ONE_PARAGRAPH)
  setCursor(editor, 'p1.content', 0)

  t.ok(canSwitchTextTypeTo(editor, 'preformat'), 'switch to preformat should be possible')
  switchTextType(editor, 'preformat')

  let preformatEl = editor.find('.sc-surface.sm-body > .sc-text-node.sm-preformat')
  t.notNil(preformatEl, 'there should be a div with preformat component class now')
  t.end()
})

const SHIFT_ENTER = parseKeyCombo('Shift+Enter')
const PREFORMAT = `<preformat id="preformat" preformat-type="code"><![CDATA[for (let i=0; i<5; i++) {
  console.log(i)
}]]></preformat>`

test('ManuscriptEditor: insert a line-break into preformat', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, PREFORMAT)
  let doc = getDocument(editor)
  let preformat = doc.get('preformat')
  let origLineCount = _getLineCount(preformat.getText())
  let bodySurface = _getBodySurface(editor)
  setCursor(editor, 'preformat.content', 0)
  bodySurface.onKeyDown(createSurfaceEvent(bodySurface, SHIFT_ENTER))
  t.equal(_getLineCount(preformat.getText()), origLineCount + 1, 'there should be a new line inserted')
  t.end()
})

test('ManuscriptEditor: insert a line-break into heading', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  let heading = doc.get('sec-1')
  let bodySurface = _getBodySurface(editor)

  setCursor(editor, 'sec-1.content', 1)
  bodySurface.onKeyDown(createSurfaceEvent(bodySurface, SHIFT_ENTER))
  let annos = heading.getAnnotations()
  t.deepEqual(['break'], annos.map(a => a.type), 'there should be a line-break inserted')
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
  t.ok(openContextMenuAndFindTool(editor, '.sm-indent-list'), 'now there should be the indent tool be visible')
  t.ok(openContextMenuAndFindTool(editor, '.sm-dedent-list'), '.. and the dedent tool')

  // click on list tool to turn it into a paragraph again
  openContextMenuAndFindTool(editor, '.sm-toggle-unordered-list').click()

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
  let ulTool = openContextMenuAndFindTool(editor, '.sm-toggle-ordered-list')
  ulTool.click()
  let listNode = doc.get('list-1')
  t.equal(listNode.listType, 'order,order,bullet', 'all levels should be ordered')

  setSelection(editor, 'li1_1.content', 0)
  let olTool = openContextMenuAndFindTool(editor, '.sm-toggle-unordered-list')
  olTool.click()
  t.equal(listNode.listType, 'order,bullet,bullet', 'all levels should be ordered')

  t.end()
})

test('ManuscriptEditor: increasing and decreasing level of list items using TAB', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  loadBodyFixture(editor, TINY_LIST)
  let bodySurface = _getBodySurface(editor)
  function _indent () {
    bodySurface.onKeyDown(createSurfaceEvent(bodySurface, TAB))
  }
  function _dedent () {
    bodySurface.onKeyDown(createSurfaceEvent(bodySurface, SHIFT_TAB))
  }

  setCursor(editor, 'li1-2.content', 0)
  let item = doc.get('li1-2')
  t.comment('increasing item level')
  _indent()
  t.equal(item.level, 3, 'level should have been increased')
  _indent()
  t.equal(item.level, 3, 'level should not be increased higher than level 3')
  t.comment('decreasing item level')
  _dedent()
  t.equal(item.level, 2, 'level should have been decreased')
  _dedent()
  t.equal(item.level, 1, 'level should have been decreased')
  _dedent()
  t.equal(item.level, 1, 'level should not be decreased lower than level 1')

  t.end()
})

test('ManuscriptEditor: increasing and decreasing level of list items via tool', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  loadBodyFixture(editor, TINY_LIST)
  function _indent () {
    openMenuAndFindTool(editor, 'context-tools', '.sm-indent-list').click()
  }
  function _dedent () {
    openMenuAndFindTool(editor, 'context-tools', '.sm-dedent-list').click()
  }

  setCursor(editor, 'li1-2.content', 0)
  let item = doc.get('li1-2')
  t.comment('increasing item level')
  _indent()
  t.equal(item.level, 3, 'level should have been increased')
  t.comment('decreasing item level')
  _dedent()
  t.equal(item.level, 2, 'level should have been decreased')
  _dedent()
  t.equal(item.level, 1, 'level should have been decreased')

  t.end()
})

const P_WITH_EXTERNAL_LINK = `<p id="p1">This is a <ext-link xmlns:xlink="http://www.w3.org/1999/xlink" id="link" xlink:href="test">link</ext-link></p>`

test('ManuscriptEditor: editing an external link', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  loadBodyFixture(editor, P_WITH_EXTERNAL_LINK)

  function _getHrefEditor () { return editor.find('.sc-external-link-editor .se-href') }

  let link = doc.get('link')
  setCursor(editor, 'p1.content', link.start.offset + 1)
  // there should now be the popup open
  // now put a cursor there and type
  let hrefEditor = _getHrefEditor()
  t.ok(Boolean(hrefEditor), 'href editor should be shown')
  setCursor(editor, `${link.id}.href`, 0)
  insertText(editor, 'foo')
  t.equal(link.href, 'footest', 'the link should have been updated')
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

const TABLE_WITH_FOOTNOTE = `
  <table-wrap id="table1">
    <table>
      <tbody>
        <tr id="t1_5">
          <td id="t1_5_1">Table footnote<xref id="t1-xref-1" ref-type="table-fn" rid="tfn1">*</xref></td>
        </tr>
      </tbody>
    </table>
    <table-wrap-foot>
      <fn-group>
        <fn id="tfn1">
          <label>*</label>
          <p id="tfn1-p1">This is a table-footnote.</p>
        </fn>
      </fn-group>
    </table-wrap-foot>
  </table-wrap>
`

test('ManuscriptEditor: removing a table figure', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, TABLE_WITH_FOOTNOTE)
  selectNode(editor, 'table1')
  doesNotThrowInNodejs(t, () => {
    deleteSelection(editor)
  }, 'table removing should not throw')
  t.isNil(editor.find('[data-id=table1]'), 'There should be no table anymore')
  t.end()
})

const SPECS = [
  {
    'type': 'block-formula',
    'tool': '.sc-tool.sm-insert-block-formula',
    'label': 'Formula'
  },
  {
    'type': 'block-quote',
    'tool': '.sc-tool.sm-insert-block-quote',
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

test('ManuscriptEditor: select all', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let editor = openManuscriptEditor(app)
  setCursor(editor, 'p-1.content', 1)
  executeCommand(editor, 'select-all')
  let sel = getSelection(editor)
  t.deepEqual({
    type: sel.type,
    startPath: sel.start.path,
    endPath: sel.end.path
  }, {
    type: 'container',
    startPath: ['sec-1', 'content'],
    endPath: ['p-5', 'content']
  })
  t.end()
})

const ENTITIES = [
  {
    'type': 'author',
    'itemSelector': '.sc-authors-list .se-contrib',
    'editToolSelector': '.sm-edit-author',
    'selectionType': 'author',
    'metadataType': 'person'
  },
  {
    'type': 'reference',
    'itemSelector': '.sc-reference-list .sc-reference',
    'editToolSelector': '.sm-edit-reference',
    'selectionType': 'reference',
    'metadataType': 'webpage-ref'
  }
]
ENTITIES.forEach(spec => {
  test(`ManuscriptEditor: ${spec.type} selection`, t => {
    testEntitySelection(t, spec)
  })

  // test(`ManuscriptEditor: edit ${spec.type} tool`, t => {
  //   testEntityEditTool(t, spec)
  // })
})

function testEntitySelection (t, spec) {
  let { app } = setupTestApp(t, { archiveId: 'kitchen-sink' })
  let editor = openManuscriptEditor(app)
  const getFirstItem = () => editor.find(spec.itemSelector)

  t.notNil(getFirstItem(), 'there should be at least one item')
  getFirstItem().el.click()
  t.ok(getFirstItem().hasClass('sm-selected'), 'first item must be visually selected')
  t.equal(getSelection(editor).type, 'custom', 'selection must be of custom type')
  t.equal(getSelection(editor).customType, spec.selectionType, `selection must be of ${spec.selectionType} custom type`)
  setSelection(editor, 'p-2.content', 0)
  t.notOk(getFirstItem().hasClass('sm-selected'), 'visual selection most be gone')
  t.notEqual(getSelection(editor).type, 'custom', 'selection must be of different type')
  t.end()
}

// FIXME: Bring back editing of authors and references
// function testEntityEditTool (t, spec) {
//   let { app } = setupTestApp(t, { archiveId: 'kitchen-sink' })
//   let editor = openManuscriptEditor(app)
//   const getFirstItem = () => editor.find(spec.itemSelector)
//   const _canEdit = () => isToolEnabled(editor, 'context-tools', spec.editToolSelector)
//   const _edit = () => openMenuAndFindTool(editor, 'context-tools', spec.editToolSelector).click()

//   t.equal(getCurrentViewName(editor), 'manuscript', `should be in manuscript view`)
//   t.notOk(_canEdit(), 'edit author should be disabled wihtout selection')
//   getFirstItem().el.click()
//   t.ok(_canEdit(), 'edit author should be enabled')
//   _edit()

//   t.equal(getCurrentViewName(editor), 'metadata', `should be in metadata view now`)
//   t.end()
// }

test('ManuscriptEditor: copy and pasting heading and paragraph', t => {
  let { app } = setupTestApp(t, LOREM_IPSUM)
  let editor = openManuscriptEditor(app)
  selectRange(editor, 'sec-1.content', 0, 'p-1.content', 10)
  let doc = getDocument(editor)
  let body = doc.get('body')
  let bodySurface = _getBodySurface(editor)
  let pasteEvent = new DOMEvent({ clipboardData: new ClipboardEventData() })
  bodySurface._onCopy(pasteEvent)
  setCursor(editor, 'p-2.content', 0)
  bodySurface._onPaste(pasteEvent)
  let third = body.getNodeAt(2)
  // TODO: the paste logic should be fixed. ATM the Heading is merged into the paragraph.
  // IMO this should not happen if the node type is different.
  t.equal(third.getText(), doc.get('sec-1').getText(), 'heading should have been pasted')
  t.end()
})

const TINY_LIST = `
<list list-type="bullet" id="list">
  <list-item id="li1">
    <p>Item 1</p>
    <list list-type="bullet">
      <list-item id="li1-1">
        <p>AAA</p>
      </list-item>
      <list-item id="li1-2">
        <p>BBB</p>
      </list-item>
    </list>
  </list-item>
  <list-item id="li2">
    <p>Item 2</p>
    <list list-type="bullet">
      <list-item id="li2-1">
        <p>XXX</p>
      </list-item>
      <list-item id="li2-2">
        <p>YYY</p>
      </list-item>
      <list-item id="li2-3">
        <p></p>
      </list-item>
    </list>
  </list-item>
</list>
`

test('ManuscriptEditor: copy and pasting list items', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  let bodySurface = _getBodySurface(editor)
  loadBodyFixture(editor, TINY_LIST)

  selectRange(editor, 'li1-1.content', 0, 'li1-2.content', 3)
  let pasteEvent = new DOMEvent({ clipboardData: new ClipboardEventData() })
  bodySurface._onCopy(pasteEvent)
  setCursor(editor, 'li2-3.content', 0)
  bodySurface._onPaste(pasteEvent)
  let list = doc.get('list')
  t.equal(list.getLength(), 8, 'altogether there should be 8 items')
  t.deepEqual(list.resolve('items').map(item => item.level), [1, 2, 2, 1, 2, 2, 2, 2], '.. with correct levels')
  t.end()
})

const TWO_FIGURES = `
<fig id="fig1">
  <graphic />
  <caption />
</fig>
<p id="p1">This is a reference to <xref id="fig1-ref" ref-type="fig" rid="fig1" />.</p>
<fig id="fig2">
  <graphic />
  <caption />
</fig>
<p id="empty"></p>
`

test('ManuscriptEditor: cut and pasting a figure', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let bodySurface = _getBodySurface(editor)
  loadBodyFixture(editor, TWO_FIGURES)

  // HACK: ATM, we are wrapping every fig into a fig-group internally, using a '_' as prefix for the id of the group
  // TODO: we should rethink if this is really what we want. IMO there is no advantage in having an implicit conversion
  // with respect to collaboration. Maybe it is better to treat FigureGroups as an extra thing.
  selectNode(editor, '_fig-1')
  let pasteEvent = new DOMEvent({ clipboardData: new ClipboardEventData() })
  bodySurface._onCut(pasteEvent)
  setCursor(editor, 'empty.content', 0)
  bodySurface._onPaste(pasteEvent)

  const expectedLabel = 'Figure 2'
  let fig1Comp = bodySurface.find('[data-id="fig1"]')
  let fig1Label = fig1Comp.find('.sc-label')
  let refComp = bodySurface.find('[data-id="fig1-ref"]')
  t.ok(Boolean(fig1Comp), 'figure 1 should be displayed')
  t.equal(fig1Label.text(), expectedLabel, 'figure should have been labeled automatically')
  t.equal(refComp.text(), expectedLabel, 'figure reference should have been relabeled automatically')

  t.end()
})

const TABLE_AND_REF = `
  <table-wrap id="table1">
    <table>
    </table>
  </table-wrap>
  <p id="p1">This is a reference to <xref id="table1-ref" ref-type="table" rid="table1" />.</p>
  <table-wrap id="table2">
    <table>
    </table>
  </table-wrap>
  <p id="empty"></p>
  `

test('ManuscriptEditor: cut and pasting a table', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let bodySurface = _getBodySurface(editor)
  loadBodyFixture(editor, TABLE_AND_REF)

  selectNode(editor, 'table1')
  let pasteEvent = new DOMEvent({ clipboardData: new ClipboardEventData() })
  bodySurface._onCut(pasteEvent)
  setCursor(editor, 'empty.content', 0)
  bodySurface._onPaste(pasteEvent)

  const expectedLabel = 'Table 2'
  let table1Comp = bodySurface.find('[data-id="table1"]')
  let table1Label = table1Comp.find('.sc-label')
  let refComp = bodySurface.find('[data-id="table1-ref"]')
  t.ok(Boolean(table1Comp), 'table should be displayed')
  t.equal(table1Label.text(), expectedLabel, 'table should have been labeled automatically')
  t.equal(refComp.text(), expectedLabel, 'table reference should have been relabeled automatically')

  t.end()
})

function _getLineCount (str) {
  return str.split(/\r\n|\r|\n/).length
}

function _getBodySurface (editor) {
  return editor.getContentPanel().find('.sc-surface[data-surface-id="body"]')
}
