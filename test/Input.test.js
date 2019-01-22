import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { openMetadataEditor } from './shared/integrationTestHelpers'

test('Input: ManyRelationship dropdown', t => {
  let { app } = setupTestApp(t, { archiveId: 'kitchen-sink' })
  let metadataEditor = openMetadataEditor(app)
  // ATTENTION: just taking the first ManyRelationshipInput we find
  let manyRelationship = metadataEditor.find('.sc-many-relationship')
  let selectInput = manyRelationship.find('.sc-multi-select-input')
  t.ok(selectInput.el.is('.sm-collapsed'), 'the dropdown should be collapsed in the beginning')
  // click on the input to open the dropdown
  selectInput.el.click()
  t.ok(selectInput.el.is('.sm-expanded'), 'the dropdown should be expanded')
  // ATTENTION: just taking the first item in the list
  let item = selectInput.find('.se-select-item')
  let wasSelected = item.el.is('.sm-selected')
  item.click()
  // we want that the dropdown remains open
  t.ok(selectInput.el.is('.sm-expanded'), 'the dropdown should still be expanded')
  // and the specific item should be selected now
  // Note: better to get the item again, in case that the drop down get rendered from scratch
  item = selectInput.find('.se-select-item')
  let isSelected = item.el.is('.sm-selected')
  t.equal(isSelected, !wasSelected, 'the item selection should have changed')
  t.end()
})
