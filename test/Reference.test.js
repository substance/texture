import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { JATS_BIBR_TYPES_TO_INTERNAL, INTERNAL_BIBR_TYPES } from 'substance-texture'
import {
  setSelection,
  insertText, openContextMenuAndFindTool, openMenuAndFindTool, getModalEditor, startEditMetadata, closeModalEditor
} from './shared/integrationTestHelpers'
import { doesNotThrowInNodejs } from './shared/testHelpers'
import CSLJSON from './fixture/csl-json/csl-json-example'

const emptyLabel = '???'
const removeToolSelector = '.sm-remove-entity'

// addding reference is done in a workflow, where the user can choose to import, or select a specific type
// TODO: we should also test the other ways to create reference (actually we should cover all cases)
// For now, I have added only the following tests for adding manually
INTERNAL_BIBR_TYPES.forEach(bibrType => {
  test(`Reference: add reference [type=${bibrType}]`, t => {
    _testAddReference(t, bibrType)
  })
})

function _testAddReference (t, bibrType) {
  let { editor } = setupTestApp(t, { archiveId: 'blank' })
  doesNotThrowInNodejs(t, () => {
    _addReference(editor, bibrType)
  })
  t.notNil(editor.find(`.sc-card.sm-${bibrType}`), 'there should be a card for the new entitiy')
  t.end()
}

/*
  Declare a test that tests creation for each available reference type
*/
const RefTypes = Object.keys(JATS_BIBR_TYPES_TO_INTERNAL)
RefTypes.forEach(refType => {
  test('Reference: Manually add ' + refType, t => {
    testRefCreationForType(t, JATS_BIBR_TYPES_TO_INTERNAL[refType])
  })
})

/*
  Ref creation test suite for a certain ref type
*/
function testRefCreationForType (t, refType) {
  const CARD_IN_REFERENCES = '.sc-metadata-section.sm-references .sc-card'
  let { editor } = setupTestApp(t, { archiveId: 'blank' })
  let workflow = _openWorkflow(editor)
  let addRefBtn = workflow.find('.se-manual-add .sm-' + refType)
  addRefBtn.click()
  // check if new item added
  let cards = editor.findAll(CARD_IN_REFERENCES)
  let numberOfRefCards = cards.length
  t.equal(numberOfRefCards, 1, 'There should be one new card for the added reference')
  // TODO: make sure that the editor is displayed correctly
  t.end()
}

test(`Reference: adding and editing authors`, t => {
  let { editor } = setupTestApp(t, { archiveId: 'blank' })
  _addReference(editor, 'journal-article-ref')
  let metadataEditor = getModalEditor(editor)
  let card = metadataEditor.find('.sc-card.sm-journal-article-ref')
  card.find('.sm-authors .se-add-value').el.click()
  let refContribEl = card.find('.sm-authors .sm-ref-contrib')
  let refContribId = refContribEl.attr('data-id')
  setSelection(metadataEditor, [refContribId, 'name'], 0)
  insertText(metadataEditor, 'Doe')
  setSelection(metadataEditor, [refContribId, 'givenNames'], 0)
  insertText(metadataEditor, 'John')
  // this is very style specific
  // TODO: is there a better way to test the effect of editing?
  let previewText = card.find('.sc-model-preview').text()
  t.ok(previewText.search('Doe') > -1, 'preview should display surname of author')
  t.end()
})

test(`Reference: removing`, t => {
  let { editor } = setupTestApp(t, { archiveId: 'kitchen-sink' })
  let metadataEditor = startEditMetadata(editor)
  let card = metadataEditor.find('.sc-card.sm-webpage-ref')
  card.el.click()

  t.comment('removing reference')
  t.ok(_canRemoveReference(metadataEditor), 'remove tool should not be disabled')
  t.ok(_removeReference(metadataEditor), 'remove should not throw')

  t.comment('check what happened with xrefs')
  closeModalEditor(metadataEditor)
  let xref = editor.find('.sc-xref')
  t.equal(xref.text(), emptyLabel, 'xref label should not contain reference')

  t.end()
})

test(`Reference: upload CSL-JSON set`, t => {
  let { editor } = setupTestApp(t, { archiveId: 'blank' })
  let workflow = _openWorkflow(editor)
  doesNotThrowInNodejs(t, () => {
    // TODO: we should find a way to load json from fixtures
    // would be good to read it via handleUploadedFiles method
    workflow.find('.sc-file-upload')._onFileLoad({ target: { result: JSON.stringify(CSLJSON) } })
  }, 'citations file upload should not throw')
  let metadataEditor = getModalEditor(editor)
  const references = metadataEditor.findAll(`.sc-metadata-section.sm-references .sc-card`)
  t.equal(references.length, 3, 'there should be three new cards')
  t.end()
})

test(`Reference: query DOI`, t => {
  let { editor } = setupTestApp(t, { archiveId: 'blank' })
  let workflow = _openWorkflow(editor)
  const DOI = '10.7554/eLife.42837'
  doesNotThrowInNodejs(t, () => {
    const doiInput = workflow.find('.sc-doi-input')
    doiInput.find('input').val(DOI)
    doiInput.find('button').click()
  }, 'citations file upload should not throw')
  // TODO: we should provide our own fake service which will return json
  // and test conversion and error handling
  t.end()
})

function _addReference (editor, bibrType) {
  let menu = editor.find('.sc-tool-dropdown.sm-insert')
  menu.find('button').el.click()
  menu.find(`.sc-tool.sm-add-reference`).el.click()
  editor.find(`.sc-modal-dialog .sc-add-reference .se-type.sm-${bibrType}`).click()
}

function _openWorkflow (metadataEditor) {
  // open the add drop down
  let addDropDown = metadataEditor.find('.sc-tool-dropdown.sm-insert')
  addDropDown.find('button').click()
  // click on the add-reference button
  addDropDown.find('.sc-tool.sm-add-reference').click()
  let workflow = metadataEditor.find('.se-workflow-modal')
  return workflow
}

// function _addinsertReference (editor, bibrType) {
//   openMenuAndFindTool(editor, 'insert', '.sm-insert-reference').click()
//   // ... this opens a modal where we click on the button for creating the particular bibr type
//   editor.find(`.sc-modal-dialog .sc-add-reference .se-type.sm-${bibrType}`).click()
// }

function _canRemoveReference (editor) {
  let tool = openMenuAndFindTool(editor, 'context-tools', removeToolSelector)
  return tool && !tool.attr('disabled')
}

function _removeReference (editor) {
  let tool = openContextMenuAndFindTool(editor, removeToolSelector)
  return tool.el.click()
}
