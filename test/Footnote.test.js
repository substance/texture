import { test } from 'substance-test'
import { openManuscriptEditor, openMetadataEditor, getDocument, getSelectionState, setSelection, fixture } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'
import { getLabel } from '../index'

const manuscriptFootnoteSelector = '.sc-manuscript > .sc-footnote-group > .sc-footnote'
const tableFootnoteSelector = '.sc-table-figure > .se-table-figure-footnotes > .sc-footnote'
const metadataEditorFootnoteSelector = '.sc-card > .sc-footnote'
const metadataEditorTableFootnoteSelector = '.sc-card > .sc-table-figure-metadata .sc-footnote'
const footnoteContentXpath = ['article', 'content', 'back', 'footnotes', 'fn', 'p']
const tableFootnoteContentXpath = ['article', 'content', 'body', 'table-figure', 'fn', 'p']

test('Footnotes: add a footnote in the manuscript while selection is outside the table figure', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(tableFootnoteSelector).length, 2, 'there should be two table footnotes')
  setSelection(editor, 'p-0.content', 1)
  insertFootnoteIntoManuscript(editor)
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 2, 'there should be two manuscript footnotes')
  t.equal(editor.findAll(tableFootnoteSelector).length, 2, 'there should be two table footnotes')
  const xpath = getCurrentXpath(editor)
  t.deepEqual(xpath, footnoteContentXpath, 'selection should be inside manuscript footnote')
  t.end()
})

test('Footnotes: add a footnote in the manuscript while selection is on isolated node with a table figure', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  const editorSession = editor.editorSession
  // set selection on table-figure isolated node
  editorSession.setSelection({
    type: 'node',
    nodeId: 'table-1',
    surfaceId: 'body',
    containerId: 'body'
  })
  insertFootnoteIntoManuscript(editor)
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(tableFootnoteSelector).length, 3, 'there should be three table footnotes')
  const xpath = getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: add a footnote in the manuscript while selection is inside a table cell', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  // set selection inside table cell
  setSelection(editor, 't-1_2_1.content', 1)
  insertFootnoteIntoManuscript(editor)
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(tableFootnoteSelector).length, 3, 'there should be three table footnotes')
  const xpath = getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: add a footnote in the manuscript while selection is on table cell', t => {
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
  insertFootnoteIntoManuscript(editor)
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(tableFootnoteSelector).length, 3, 'there should be three table footnotes')
  const xpath = getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: add a footnote in the manuscript while selection is inside a table caption', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  // set selection inside table figure caption
  setSelection(editor, 'table-1-caption-p-1.content', 1)
  insertFootnoteIntoManuscript(editor)
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(tableFootnoteSelector).length, 3, 'there should be three table footnotes')
  const xpath = getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: add a footnote in the metadata while selection is outside the table figure', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openMetadataEditor(app)
  let api = editor.context.api
  t.equal(editor.findAll(metadataEditorFootnoteSelector).length, 1, 'there should be one footnote')
  t.equal(editor.findAll(metadataEditorTableFootnoteSelector).length, 2, 'there should be two footnotes')
  api.selectModel('article-record')
  insertFootnoteIntoMetadataEditor(editor)
  t.equal(editor.findAll(metadataEditorFootnoteSelector).length, 2, 'there should be two footnotes')
  t.equal(editor.findAll(metadataEditorTableFootnoteSelector).length, 2, 'there should be two footnotes')
  const xpath = getCurrentXpath(editor)
  t.deepEqual(xpath, footnoteContentXpath, 'selection should be inside manuscript footnote')
  t.end()
})

test('Footnotes: add a footnote in the metadata while selection is on card with a table figure', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openMetadataEditor(app)
  let api = editor.context.api
  api.selectModel('table-1')
  insertFootnoteIntoMetadataEditor(editor)
  t.equal(editor.findAll(metadataEditorFootnoteSelector).length, 1, 'there should be one footnote')
  t.equal(editor.findAll(metadataEditorTableFootnoteSelector).length, 3, 'there should be three footnotes')
  const xpath = getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside manuscript footnote')
  t.end()
})

test('Footnotes: add a footnote in the metadata while selection is inside a table cell', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openMetadataEditor(app)
  // set selection inside table cell
  setSelection(editor, 't-1_2_1.content', 1)
  insertFootnoteIntoMetadataEditor(editor)
  t.equal(editor.findAll(metadataEditorFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(metadataEditorTableFootnoteSelector).length, 3, 'there should be three table footnotes')
  const xpath = getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: add a footnote in the metadata while selection is on table cell', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openMetadataEditor(app)
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
  insertFootnoteIntoMetadataEditor(editor)
  t.equal(editor.findAll(metadataEditorFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(metadataEditorTableFootnoteSelector).length, 3, 'there should be three table footnotes')
  const xpath = getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: add a footnote in the metadata while selection is inside a table caption', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openMetadataEditor(app)
  // set selection inside table cell
  setSelection(editor, 'table-1-caption-p-1.content', 1)
  insertFootnoteIntoMetadataEditor(editor)
  t.equal(editor.findAll(metadataEditorFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(metadataEditorTableFootnoteSelector).length, 3, 'there should be three table footnotes')
  const xpath = getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: remove a manuscript footnote', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(tableFootnoteSelector).length, 2, 'there should be two table footnotes')
  t.isNil(selectRemoveButton(editor), 'there should be no visible remove button')
  setSelection(editor, 'fn-1-p-1.content', 1)
  const removeBtn = selectRemoveButton(editor)
  t.ok(removeBtn, 'there should be visible remove button')
  removeBtn.click()
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 0, 'there should be one manuscript footnote')
  t.equal(editor.findAll(tableFootnoteSelector).length, 2, 'there should be two table footnotes')
  t.end()
})

test('Footnotes: remove a table footnote', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(tableFootnoteSelector).length, 2, 'there should be two table footnotes')
  t.isNil(selectRemoveButton(editor), 'there should be no visible remove button')
  setSelection(editor, 'table-1-fn-1-p-1.content', 1)
  const removeBtn = selectRemoveButton(editor)
  t.ok(removeBtn, 'there should be visible remove button')
  removeBtn.click()
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(tableFootnoteSelector).length, 1, 'there should be two table footnotes')
  t.end()
})

test('Footnotes: reference a footnote from a paragraph in the manuscript body', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  setSelection(editor, 'p-0.content', 1)
  _insertCrossRef(editor, 'fn', 'fn-1')
  let p0 = doc.get('p-0')
  let annos = p0.getAnnotations()
  let xref = annos[0]
  if (xref) {
    let actual = {
      type: xref.type,
      refType: xref.getAttribute('ref-type'),
      rid: xref.getAttribute('rid')
    }
    let expected = {
      type: 'xref',
      refType: 'fn',
      rid: 'fn-1'
    }
    t.deepEqual(actual, expected, 'a xref to fn-1 should have been created')
    t.equal(getLabel(xref), '1', 'label should be correct')
  } else {
    t.fail('xref has not been created')
  }
  t.end()
})

test('Footnotes: reference a footnote from a table-cell', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  setSelection(editor, 't-1_2_1.content', 1)
  _insertCrossRef(editor, 'fn', 'table-1-fn-1')
  let td = doc.get('t-1_2_1')
  let annos = td.getAnnotations()
  let xref = annos[0]
  if (xref) {
    let actual = {
      type: xref.type,
      refType: xref.getAttribute('ref-type'),
      rid: xref.getAttribute('rid')
    }
    let expected = {
      type: 'xref',
      refType: 'table-fn',
      rid: 'table-1-fn-1'
    }
    t.deepEqual(actual, expected, 'a xref to table-1-fn-1 should have been created')
    t.equal(getLabel(xref), '*', 'label should be correct')
  } else {
    t.fail('xref has not been created')
  }
  t.end()
})

test('Footnotes: reference a footnote from a table caption', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  setSelection(editor, 'table-1-caption-p-1.content', 1)
  _insertCrossRef(editor, 'fn', 'table-1-fn-1')
  let p = doc.get('table-1-caption-p-1')
  let annos = p.getAnnotations()
  let xref = annos[0]
  if (xref) {
    let actual = {
      type: xref.type,
      refType: xref.getAttribute('ref-type'),
      rid: xref.getAttribute('rid')
    }
    let expected = {
      type: 'xref',
      refType: 'table-fn',
      rid: 'table-1-fn-1'
    }
    t.deepEqual(actual, expected, 'a xref to table-1-fn-1 should have been created')
    t.equal(getLabel(xref), '*', 'label should be correct')
  } else {
    t.fail('xref has not been created')
  }
  t.end()
})

function _insertCrossRef (editor, refType, rid) {
  let citeMenu = editor.find('.sc-tool-dropdown.sm-cite')
  // open cite menu
  citeMenu.find('button').el.click()
  // click respective tool
  citeMenu.find(`.sm-insert-xref-${refType}`).el.click()
  // ..then the xref should be inserted with empty content
  // click on the target option with the given node id
  editor.find(`.sc-edit-xref-tool > .se-option > *[data-id=${rid}]`).click()
}

function insertFootnoteIntoManuscript (el) {
  const insertDropdown = el.find('.sc-tool-dropdown.sm-insert .sc-button')
  // Check if dropdown is already active
  const isDropDownOpened = insertDropdown.hasClass('sm-active')
  if (!isDropDownOpened) {
    insertDropdown.click()
  }
  let insertFootnoteBtn = el.find('.sc-menu-item.sm-insert-footnote')
  insertFootnoteBtn.click()
}

function insertFootnoteIntoMetadataEditor (el) {
  const addDropdown = el.find('.sc-tool-dropdown.sm-add .sc-button')
  // Check if dropdown is already active
  const isDropDownOpened = addDropdown.hasClass('sm-active')
  if (!isDropDownOpened) {
    addDropdown.click()
  }
  let addFootnoteBtn = el.find('.sc-menu-item.sm-add-footnote')
  addFootnoteBtn.click()
}

function getCurrentXpath (el) {
  const selectionState = getSelectionState(el)
  return selectionState.xpath
}

function selectRemoveButton (el) {
  const removeBtn = el.find('.sm-remove-footnote .sc-button')
  return removeBtn
}
