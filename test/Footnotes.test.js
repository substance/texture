import { test } from 'substance-test'
import {
  openManuscriptEditor, getDocument, getSelectionState, setSelection, fixture,
  openContextMenuAndFindTool, openMenuAndFindTool, getSelection, selectNode
} from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'
import { getLabel } from '../index'

const emptyLabel = '???'
const manuscriptFootnoteSelector = '.sc-manuscript > .sc-manuscript-section.sm-footnotes .sc-footnote'
const tableFootnoteSelector = '.sc-table-figure > .se-footnotes > .sc-footnote'
const tableFootnoteContentXpath = ['article', 'body', 'table-figure', 'footnote', 'paragraph']

test('Footnotes: add a footnote while selection is in the manuscript body', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  setSelection(editor, 'p-0.content', 1)
  _insertFootnote(editor)
  t.equal(_getManuscriptFootnotes(editor).length, 2, 'there should be two manuscript footnotes')
  let xpath = _getCurrentXpath(editor)
  let footnoteEntry = xpath.find(e => e.type === 'footnote')
  let sel = getSelection(editor)
  t.notNil(footnoteEntry, 'selection should be inside manuscript footnote')
  t.deepEqual({
    surfaceId: sel.surfaceId,
    containerPath: sel.containerPath
  }, {
    surfaceId: `${footnoteEntry.id}.content`,
    containerPath: [footnoteEntry.id, 'content']
  }, 'selection should have correct surfaceId and containerPath')
  t.end()
})

test('Footnotes: add a footnote while selection is on a table figure', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  selectNode(editor, 'table-1')
  _insertFootnote(editor)
  t.equal(_getTableFootnotes(editor).length, 3, 'there should be three table footnotes')
  t.deepEqual(_getCurrentXpathTypes(editor), tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: add a footnote while selection is inside a table cell', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  // set selection inside table cell
  setSelection(editor, 't-1_2_1.content', 1)
  _insertFootnote(editor)
  t.equal(_getTableFootnotes(editor).length, 3, 'there should be three table footnotes')
  t.deepEqual(_getCurrentXpathTypes(editor), tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: add a footnote while selection is on a table cell', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  const editorSession = editor.editorSession
  // set selection on table cell
  editorSession.setSelection({
    type: 'custom',
    customType: 'table',
    nodeId: 't-1',
    surfaceId: 't-1',
    data: {
      anchorCellId: 't-1_2_2',
      focusCellId: 't-1_2_2'
    }
  })
  _insertFootnote(editor)
  t.equal(_getTableFootnotes(editor).length, 3, 'there should be three table footnotes')
  t.deepEqual(_getCurrentXpathTypes(editor), tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: add a footnote in the manuscript while selection is inside a table caption', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  // set selection inside table figure caption
  setSelection(editor, 'table-1-caption-p-1.content', 1)
  _insertFootnote(editor)
  t.equal(_getTableFootnotes(editor).length, 3, 'there should be three table footnotes')
  t.deepEqual(_getCurrentXpathTypes(editor), tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: remove a manuscript footnote', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  const getFirstFootnote = () => editor.find('[data-id=fn-1]')
  const getFirstFootnoteXref = () => editor.find('[data-id=p1-xref-1]')
  t.notNil(getFirstFootnote(), 'the footnote should be visible')
  setSelection(editor, 'fn-1-p-1.content', 1)
  const removeTool = openContextMenuAndFindTool(editor, '.sm-remove-footnote')
  t.ok(removeTool, 'there should be a remove button')
  removeTool.click()
  t.isNil(doc.get('fn-1'), 'the footnote should have been removed from the model')
  t.isNil(editor.find('[data-id=fn-1]'), '.. and should not be visible anymore')
  t.equal(getFirstFootnoteXref().text(), emptyLabel, 'xref label should not contain reference')
  t.end()
})

test('Footnotes: remove a table footnote', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  t.notNil(editor.find('[data-id=table-1-fn-1]'), 'the table footnote should be visible')
  setSelection(editor, 'table-1-fn-1-p-1.content', 1)
  const removeTool = openContextMenuAndFindTool(editor, '.sm-remove-footnote')
  t.ok(removeTool, 'there should be a remove button')
  removeTool.click()
  t.isNil(doc.get('table-1-fn-1'), 'the table footnote should have been removed from the model')
  t.isNil(editor.find('[data-id=table-1-fn-1]'), '.. and should not be visible anymore')
  t.end()
})

test('Footnotes: reference a footnote from a paragraph in the manuscript body', t => {
  _testInsertXref(t, ['p-0', 'content'], 'footnote', 'fn', 'fn-1', '1')
})

test('Footnotes: reference a footnote from a table-cell', t => {
  _testInsertXref(t, ['t-1_2_1', 'content'], 'footnote', 'table-fn', 'table-1-fn-1', '*')
})

test('Footnotes: reference a footnote from a table caption', t => {
  _testInsertXref(t, ['table-1-caption-p-1', 'content'], 'footnote', 'table-fn', 'table-1-fn-1', '*')
})

test('Footnotes: add a reference citation to a paragraph in the body', t => {
  _testInsertXref(t, ['p-0', 'content'], 'bibr', 'bibr', 'r-1', '[1]')
})

test('Footnotes: add a reference citation into a table title', t => {
  _testInsertXref(t, ['table-1', 'title'], 'bibr', 'bibr', 'r-1', '[1]')
})

test('Footnotes: add a reference citation into a table caption', t => {
  _testInsertXref(t, ['table-1-caption-p-1', 'content'], 'bibr', 'bibr', 'r-1', '[1]')
})

test('Footnotes: add a reference citation into a table cell', t => {
  _testInsertXref(t, ['t-1_2_1', 'content'], 'bibr', 'bibr', 'r-1', '[1]')
})

function _testInsertXref (t, path, refTool, refType, rid, label) {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  setSelection(editor, path, 1)
  _insertCrossRef(editor, refTool, rid)
  let annos = doc.getAnnotations(path)
  let xref = annos[0]
  if (xref) {
    let actual = {
      type: xref.type,
      refType: xref.refType,
      refTargets: xref.refTargets
    }
    let expected = {
      type: 'xref',
      refType,
      refTargets: rid.split(' ')
    }
    t.deepEqual(actual, expected, 'a xref should have been created')
    t.equal(getLabel(xref), label, 'label should be correct')
  } else {
    t.fail('xref has not been created')
  }
  t.end()
}

function _insertCrossRef (editor, refType, rid) {
  let tool = openMenuAndFindTool(editor, 'insert', `.sm-insert-xref-${refType}`)
  tool.click()
  // an empty xref should have been inserted
  // click on the target option with the given node id
  editor.find(`.sc-edit-xref-tool > .se-option > *[data-id=${rid}]`).click()
}

function _insertFootnote (el) {
  const insertDropdown = el.find('.sc-tool-dropdown.sm-insert .sc-button')
  // Check if dropdown is already active
  const isDropDownOpened = insertDropdown.hasClass('sm-active')
  if (!isDropDownOpened) {
    insertDropdown.click()
  }
  let insertFootnoteBtn = el.find('.sc-tool.sm-insert-footnote')
  insertFootnoteBtn.click()
}

function _getCurrentXpath (editor) {
  const selectionState = getSelectionState(editor)
  return selectionState.xpath
}

function _getCurrentXpathTypes (editor) {
  const xpath = _getCurrentXpath(editor)
  return xpath.map(p => p.type)
}

function _getManuscriptFootnotes (editor) {
  return editor.findAll(manuscriptFootnoteSelector)
}

function _getTableFootnotes (editor, tableId) {
  return editor.findAll(tableFootnoteSelector)
}
