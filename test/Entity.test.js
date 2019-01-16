import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { openMetadataEditor, selectCard, clickUndo, getSelection, getSelectionState } from './shared/integrationTestHelpers'
import { doesNotThrowInNodejs } from './shared/testHelpers'

test(`Entity: add author`, t => {
  _entityTest(t, 'person', 'author')
})

test(`Entity: add editor`, t => {
  _entityTest(t, 'person', 'editor')
})

test(`Entity: add group`, t => {
  _entityTest(t, 'group')
})

test(`Entity: add affiliation`, t => {
  _entityTest(t, 'organisation')
})

test(`Entity: add award`, t => {
  _entityTest(t, 'award')
})

test(`Entity: add keyword`, t => {
  _entityTest(t, 'keyword')
})

test(`Entity: add subject`, t => {
  _entityTest(t, 'subject')
})

test(`Entity: add footnote`, t => {
  _entityTest(t, 'footnote', 'footnote', (t, sel, selState) => {
    t.equal(sel.type, 'property', 'selection should be an property selection')
    t.ok(Boolean(selState.xpath.find(e => e.type === 'paragraph')), '.. inside a paragraph')
  })
})

function _entityTest (t, entityType, entityName, checkSelection) {
  entityName = entityName || entityType

  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openMetadataEditor(app)

  const CARD_SELECTOR = `.sc-card.sm-${entityType}`
  const _hasCard = () => { return Boolean(editor.find(CARD_SELECTOR)) }
  const _getModelId = () => { return editor.find(CARD_SELECTOR).getAttribute('data-id') }
  function _defaultCheckSelection (t, sel) {
    t.deepEqual({
      type: sel.type,
      nodeId: sel.getNodeId()
    }, {
      type: 'property',
      nodeId: _getModelId()
    }, 'a field in the new entity should be selected')
  }

  doesNotThrowInNodejs(t, () => {
    _insertEntity(editor, entityName)
  })
  t.ok(_hasCard(), 'there should be a card for the new entitiy')
  // Note: checking the selection as good as we can. The selected field us derived from the node schema and settings
  // TODO: we could apply a specific configuration so that we know the field name
  let sel = getSelection(editor)
  let selState = getSelectionState(editor)
  let _checkSelection = checkSelection || _defaultCheckSelection
  _checkSelection(t, sel, selState)

  // in addition to the plain 'Add Entity' we also test 'Remove+Undo'
  selectCard(editor, _getModelId())
  _removeEntity(editor, entityName)
  t.notOk(_hasCard(), 'card should have been removed')
  clickUndo(editor)
  t.ok(_hasCard(), 'card should be back again')

  t.end()
}

function _insertEntity (editor, entityName) {
  // open the corresponding dropdown
  let menu = editor.find('.sc-tool-dropdown.sm-insert')
  menu.find('button').el.click()
  let addButton = menu.find(`.sc-menu-item.sm-insert-${entityName}`).el
  return addButton.click()
}

function _removeEntity (editor, entityName) {
  let collectionTools = editor.find('.sc-tool-dropdown.sm-collection-tools')
  collectionTools.refs.toggle.el.click()
  editor.find(`.sc-menu-item.sm-remove-${entityName}`).el.click()
}
