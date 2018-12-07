import { test } from 'substance-test'
import { INTERNAL_BIBR_TYPES } from '../index'
import setupTestApp from './shared/setupTestApp'
import { openMetadataEditor } from './shared/integrationTestHelpers'

test(`AddEntity: add author`, t => {
  _testAddEntity(t, 'author', 'person')
})

test(`AddEntity: add editor`, t => {
  _testAddEntity(t, 'editor', 'person')
})

test(`AddEntity: add group`, t => {
  _testAddEntity(t, 'group', 'group')
})

test(`AddEntity: add organisation`, t => {
  _testAddEntity(t, 'organisation', 'organisation')
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
  _testAddEntity(t, 'footnote', 'fn')
})

// addding reference is done in a workflow, where the user can choose to import, or select a specific type
// TODO: we should also test the other ways to create reference (actually we should cover all cases)
// For now, I have added only the following tests for adding manually
INTERNAL_BIBR_TYPES.forEach(bibrType => {
  test(`AddEntity: add reference [type=${bibrType}]`, t => {
    _testAddReference(t, bibrType)
  })
})

function _testAddEntity (t, toolName, entityType) {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openMetadataEditor(app)
  // NOTE: this will only fail in the nodejs test suite, because browser runs the click
  // in a try-catch block (or so)
  t.doesNotThrow(() => {
    _addEntity(editor, toolName)
  })
  t.notNil(editor.find(`.sc-card.sm-${entityType}`), 'there should be a card for the new entitiy')
  t.end()
}

function _testAddReference (t, bibrType) {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openMetadataEditor(app)
  t.doesNotThrow(() => {
    let menu = editor.find('.sc-tool-dropdown.sm-add')
    menu.find('button').el.click()
    menu.find(`.sc-menu-item.sm-add-reference`).el.click()
    // ... this opens a modal
    editor.find(`.sc-modal-dialog .se-add-reference .se-type.sm-${bibrType}`).click()
  })
  t.notNil(editor.find(`.sc-card.sm-${bibrType}`), 'there should be a card for the new entitiy')
  t.end()
}

function _addEntity (editor, toolName) {
  // open the corresponding dropdown
  let menu = editor.find('.sc-tool-dropdown.sm-add')
  menu.find('button').el.click()
  let addButton = menu.find(`.sc-menu-item.sm-add-${toolName}`).el
  return addButton.click()
}
