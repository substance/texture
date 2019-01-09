import { test } from 'substance-test'
import { INTERNAL_BIBR_TYPES } from '../index'
import setupTestApp from './shared/setupTestApp'
import { openMetadataEditor } from './shared/integrationTestHelpers'
import { doesNotThrowInNodejs } from './shared/testHelpers'

test(`AddEntity: add author`, t => {
  _testAddEntity(t, 'author', 'person')
})

test(`AddEntity: add editor`, t => {
  _testAddEntity(t, 'editor', 'person')
})

test(`AddEntity: add group`, t => {
  _testAddEntity(t, 'group', 'group')
})

test(`AddEntity: add affiliation`, t => {
  _testAddEntity(t, 'affiliation', 'organisation')
})

test(`AddEntity: add award`, t => {
  _testAddEntity(t, 'award', 'award')
})

test(`AddEntity: add keyword`, t => {
  _testAddEntity(t, 'keyword', 'keyword')
})

test(`AddEntity: add subject`, t => {
  _testAddEntity(t, 'subject', 'subject')
})

test(`AddEntity: add footnote`, t => {
  _testAddEntity(t, 'footnote', 'footnote')
})

// addding reference is done in a workflow, where the user can choose to import, or select a specific type
// TODO: we should also test the other ways to create reference (actually we should cover all cases)
// For now, I have added only the following tests for adding manually
INTERNAL_BIBR_TYPES.forEach(bibrType => {
  test(`AddEntity: add reference [type=${bibrType}]`, t => {
    _testAddReference(t, bibrType)
  })
})

function _testAddEntity (t, toolName, entityType, action) {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openMetadataEditor(app)
  // NOTE: this will only fail in the nodejs test suite, because browser runs the click
  // in a try-catch block (or so)
  doesNotThrowInNodejs(t, () => {
    _addEntity(editor, toolName)
  })
  const cardSelector = `.sc-card.sm-${entityType}`
  let card = editor.find(cardSelector)
  t.notNil(card, 'there should be a card for the new entitiy')

  // in addition to the plain 'Add Entity' we also test 'Remove+Undo'
  let modelId = card.el.getAttribute('data-id')
  editor.setSelection({
    type: 'custom',
    customType: 'model',
    nodeId: modelId,
    data: {
      modelId
    }
  })
  // remove the entity via remove button
  _removeEntity(editor, toolName)

  t.nil(editor.find(cardSelector), 'card should have been removed')
  // now undo this change and then the card should be there again
  editor.find('.sc-toggle-tool.sm-undo > button').el.click()
  t.notNil(editor.find(cardSelector), 'card should be back again')

  t.end()
}

function _testAddReference (t, bibrType) {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openMetadataEditor(app)
  doesNotThrowInNodejs(t, () => {
    let menu = editor.find('.sc-tool-dropdown.sm-add')
    menu.find('button').el.click()
    menu.find(`.sc-menu-item.sm-insert-reference`).el.click()
    // ... this opens a modal
    editor.find(`.sc-modal-dialog .se-add-reference .se-type.sm-${bibrType}`).click()
  })
  t.notNil(editor.find(`.sc-card.sm-${bibrType}`), 'there should be a card for the new entitiy')
  t.end()
}

function _addEntity (editor, toolName, action) {
  action = action || 'add'
  // open the corresponding dropdown
  let menu = editor.find('.sc-tool-dropdown.sm-insert')
  menu.find('button').el.click()
  let addButton = menu.find(`.sc-menu-item.sm-${action}-${toolName}`).el
  return addButton.click()
}

function _removeEntity (editor, toolName) {
  let collectionTools = editor.find('.sc-tool-dropdown.sm-collection-tools')
  collectionTools.refs.toggle.el.click()
  editor.find(`.sc-menu-item.sm-remove-${toolName}`).el.click()
}