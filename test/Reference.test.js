import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { JATS_BIBR_TYPES_TO_INTERNAL, INTERNAL_BIBR_TYPES } from '../index'
import { openMetadataEditor, setSelection, insertText } from './shared/integrationTestHelpers'
import { doesNotThrowInNodejs } from './shared/testHelpers'

// addding reference is done in a workflow, where the user can choose to import, or select a specific type
// TODO: we should also test the other ways to create reference (actually we should cover all cases)
// For now, I have added only the following tests for adding manually
INTERNAL_BIBR_TYPES.forEach(bibrType => {
  test(`Entity: add reference [type=${bibrType}]`, t => {
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

test(`Reference: edit a referencem adding and editing authors`, t => {
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

function _addReference (editor, bibrType) {
  let menu = editor.find('.sc-tool-dropdown.sm-insert')
  menu.find('button').el.click()
  menu.find(`.sc-menu-item.sm-insert-reference`).el.click()
  editor.find(`.sc-modal-dialog .se-add-reference .se-type.sm-${bibrType}`).click()
}

function _openWorkflow (metadataEditor) {
  // open the add drop down
  let addDropDown = metadataEditor.find('.sc-tool-dropdown.sm-insert')
  addDropDown.find('button').click()
  // click on the add-reference button
  addDropDown.find('.sc-menu-item.sm-insert-reference').click()
  let workflow = metadataEditor.find('.se-workflow-modal')
  return workflow
}

function _insertReference (editor, bibrType) {
  let menu = editor.find('.sc-tool-dropdown.sm-insert')
  menu.find('button').el.click()
  menu.find(`.sc-menu-item.sm-insert-reference`).el.click()
  // ... this opens a modal where we click on the button for creating the particular bibr type
  editor.find(`.sc-modal-dialog .se-add-reference .se-type.sm-${bibrType}`).click()
}
