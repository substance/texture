import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { JATS_BIBR_TYPES_TO_INTERNAL, INTERNAL_BIBR_TYPES } from 'substance-texture'
import {
  openMetadataEditor, openManuscriptEditor, setSelection,
  insertText, openContextMenuAndFindTool, openMenuAndFindTool
} from './shared/integrationTestHelpers'
import { doesNotThrowInNodejs } from './shared/testHelpers'
import CSLJSON from './fixture/csl-json/csl-json-example'

const emptyLabel = '???'
const removeReferenceToolSelector = '.sm-remove-reference'

// addding reference is done in a workflow, where the user can choose to import, or select a specific type
// TODO: we should also test the other ways to create reference (actually we should cover all cases)
// For now, I have added only the following tests for adding manually
INTERNAL_BIBR_TYPES.forEach(bibrType => {
  test(`Reference: add reference [type=${bibrType}]`, t => {
    _testAddReference(t, bibrType)
  })
})

function _testAddReference (t, bibrType) {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openMetadataEditor(app)
  doesNotThrowInNodejs(t, () => {
    _insertReference(editor, bibrType)
  })
  t.notNil(editor.find(`.sc-card.sm-${bibrType}`), 'there should be a card for the new entitiy')
  t.end()
}

test('Reference: open and closing workflow', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let metadataEditor = openMetadataEditor(app)
  let workflow = _openWorkflow(metadataEditor)
  t.notNil(workflow, 'There should be a workflow in modal')
  workflow.click()
  // check if clicking on modal closing a workflow
  workflow = metadataEditor.find('.se-workflow-modal')
  t.isNil(workflow, 'There should be no modal with a workflow')
  t.end()
})

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
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let metadataEditor = openMetadataEditor(app)
  let workflow = _openWorkflow(metadataEditor)
  let addRefBtn = workflow.find('.se-manual-add .sm-' + refType)
  addRefBtn.click()
  // check if modal got closed after click on add button
  workflow = metadataEditor.find('.se-workflow-modal')
  t.isNil(workflow, 'There should be no modal with a workflow after clicking on add button')
  // check if new item added
  let cards = metadataEditor.findAll(CARD_IN_REFERENCES)
  let numberOfRefCards = cards.length
  t.equal(numberOfRefCards, 1, 'There should be one new card for the added reference')
  // TODO: make sure that the editor is displayed correctly
  t.end()
}

test(`Reference: adding and editing authors`, t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openMetadataEditor(app)
  _addReference(editor, 'journal-article-ref')
  let card = editor.find('.sc-card.sm-journal-article-ref')
  card.find('.sm-authors .se-add-value').el.click()
  let refContribEl = card.find('.sm-authors .sm-ref-contrib')
  let refContribId = refContribEl.attr('data-id')
  setSelection(editor, [refContribId, 'name'], 0)
  insertText(editor, 'Doe')
  setSelection(editor, [refContribId, 'givenNames'], 0)
  insertText(editor, 'John')
  // this is very style specific
  // TODO: is there a better way to test the effect of editing?
  let previewText = card.find('.sc-model-preview').text()
  t.ok(previewText.search('Doe') > -1, 'preview should display surname of author')
  t.end()
})

test(`Reference: removing`, t => {
  let { app } = setupTestApp(t, { archiveId: 'kitchen-sink' })
  let metadataEditor = openMetadataEditor(app)
  let card = metadataEditor.find('.sc-card.sm-webpage-ref')
  card.el.click()

  t.comment('removing reference')
  t.ok(_canRemoveReference(metadataEditor), 'remove tool should not be disabled')
  t.ok(_removeReference(metadataEditor), 'remove should not throw')

  t.comment('check what happened with xrefs')
  let manuscriptEditor = openManuscriptEditor(app)
  let xref = manuscriptEditor.find('.sc-xref')
  t.equal(xref.text(), emptyLabel, 'xref label should not contain reference')

  t.end()
})

test(`Reference: upload CSL-JSON set`, t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let metadataEditor = openMetadataEditor(app)
  let workflow = _openWorkflow(metadataEditor)
  doesNotThrowInNodejs(t, () => {
    // TODO: we should find a way to load json from fixtures
    // would be good to read it via handleUploadedFiles method
    workflow.find('.sc-file-upload')._onFileLoad({ target: { result: JSON.stringify(CSLJSON) } })
  }, 'citations file upload should not throw')
  const references = metadataEditor.findAll(`.sc-metadata-section.sm-references .sc-card`)
  t.equal(references.length, 3, 'there should be three new cards')
  t.end()
})

test(`Reference: query DOI`, t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let metadataEditor = openMetadataEditor(app)
  let workflow = _openWorkflow(metadataEditor)
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
  menu.find(`.sc-tool.sm-insert-reference`).el.click()
  editor.find(`.sc-modal-dialog .sc-add-reference .se-type.sm-${bibrType}`).click()
}

function _openWorkflow (metadataEditor) {
  // open the add drop down
  let addDropDown = metadataEditor.find('.sc-tool-dropdown.sm-insert')
  addDropDown.find('button').click()
  // click on the add-reference button
  addDropDown.find('.sc-tool.sm-insert-reference').click()
  let workflow = metadataEditor.find('.se-workflow-modal')
  return workflow
}

function _insertReference (editor, bibrType) {
  openMenuAndFindTool(editor, 'insert', '.sm-insert-reference').click()
  // ... this opens a modal where we click on the button for creating the particular bibr type
  editor.find(`.sc-modal-dialog .sc-add-reference .se-type.sm-${bibrType}`).click()
}

function _canRemoveReference (editor) {
  let tool = openMenuAndFindTool(editor, 'context-tools', removeReferenceToolSelector)
  return tool && !tool.attr('disabled')
}

function _removeReference (editor) {
  let tool = openContextMenuAndFindTool(editor, removeReferenceToolSelector)
  return tool.el.click()
}
