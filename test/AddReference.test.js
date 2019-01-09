import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { JATS_BIBR_TYPES_TO_INTERNAL } from '../index'
import { openMetadataEditor } from './shared/integrationTestHelpers'

test('Add Reference: open and closing workflow', t => {
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
  test('Add Reference: Manually add ' + refType, t => {
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

function _openWorkflow (metadataEditor) {
  // open the add drop down
  let addDropDown = metadataEditor.find('.sc-tool-dropdown.sm-add')
  addDropDown.find('button').click()
  // click on the add-reference button
  addDropDown.find('.sc-menu-item.sm-add-reference').click()
  let workflow = metadataEditor.find('.se-workflow-modal')
  return workflow
}
