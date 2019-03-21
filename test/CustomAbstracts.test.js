import { test } from 'substance-test'
import {
  getDocument, insertText, openMetadataEditor,
  openContextMenuAndFindTool, isToolEnabled, setCursor
} from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

const customAbstractSelector = '.sc-custom-abstract'
const moveDownToolSelector = '.sm-move-down-custom-abstract'
const moveUpToolSelector = '.sm-move-up-custom-abstract'
const removeToolSelector = '.sm-remove-custom-abstract'
const getCustomAbstracts = editor => editor.findAll(customAbstractSelector)
const selectCustomAbstractCard = card => card.click()
const _isMoveDownToolPossible = editor => _isToolEnabled(editor, moveDownToolSelector)
const _isMoveUpToolPossible = editor => _isToolEnabled(editor, moveUpToolSelector)
const _isRemovePossible = editor => _isToolEnabled(editor, removeToolSelector)
const _moveDownAbstract = editor => openContextMenuAndFindTool(editor, moveDownToolSelector).click()
const _removeAbstract = editor => openContextMenuAndFindTool(editor, removeToolSelector).click()

test(`Custom Abstracts: add a custom abstract`, t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openMetadataEditor(app)
  t.equal(editor.findAll(customAbstractSelector).length, 0, 'there should be no custom abstract')
  t.doesNotThrow(() => {
    _addItem(editor, 'custom-abstract')
  }, 'adding new custom abstract should not throw error')
  t.equal(editor.findAll(customAbstractSelector).length, 1, 'there should be one custom abstract')
  t.end()
})

test(`Custom Abstracts: removing a custom abstract`, t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openMetadataEditor(app)
  _addItem(editor, 'custom-abstract')
  t.equal(editor.findAll(customAbstractSelector).length, 1, 'there should be one custom abstract')
  selectCustomAbstractCard(getCustomAbstracts(editor)[0])
  t.ok(_isRemovePossible(editor), 'should be possible to remove custom abstract')
  _removeAbstract(editor)
  t.equal(editor.findAll(customAbstractSelector).length, 0, 'there should be no custom abstract')
  t.end()
})

test('Custom Abstracts: move custom abstract', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openMetadataEditor(app)
  _addItem(editor, 'custom-abstract')
  t.notOk(_isMoveUpToolPossible(editor), 'should not be possible to move up custom abstract')
  t.notOk(_isMoveDownToolPossible(editor), 'should not be possible to move down custom abstract')
  _addItem(editor, 'custom-abstract')
  selectCustomAbstractCard(getCustomAbstracts(editor)[0])
  t.notOk(_isMoveUpToolPossible(editor), 'should not be possible to move up custom abstract')
  t.ok(_isMoveDownToolPossible(editor), 'should be possible to move down custom abstract')
  _moveDownAbstract(editor)
  t.ok(_isMoveUpToolPossible(editor), 'should be possible to move up custom abstract')
  t.notOk(_isMoveDownToolPossible(editor), 'should not be possible to move down custom abstract')
  t.end()
})

test('Custom Abstracts: editing title', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openMetadataEditor(app)
  let doc = getDocument(editor)
  const newTitle = 'Custom abstract title'
  _addItem(editor, 'custom-abstract')
  const customAbstracts = doc.get(['article', 'customAbstracts'])
  const customAbstractId = customAbstracts[0]
  t.equal(doc.get([customAbstractId, 'title']), '', 'title should be empty')
  setCursor(editor, customAbstractId + '.title', 0)
  insertText(editor, newTitle)
  t.equal(doc.get([customAbstractId, 'title']), newTitle, 'title should changed')
  t.end()
})

test('Custom Abstracts: switching type', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openMetadataEditor(app)
  let doc = getDocument(editor)
  const customAbstractType = 'executive-summary'
  _addItem(editor, 'custom-abstract')
  const customAbstracts = doc.get(['article', 'customAbstracts'])
  const customAbstractId = customAbstracts[0]
  t.equal(doc.get([customAbstractId, 'abstractType']), '', 'abstract type should be empty')
  const abstractTypeEditor = editor.find(customAbstractSelector + ' .sc-dropdown-editor')
  // since we are dealing with dropdown we should set input value
  // and call change event handler manually
  abstractTypeEditor.refs.input.setValue(customAbstractType)
  abstractTypeEditor._setValue()
  t.equal(doc.get([customAbstractId, 'abstractType']), customAbstractType, 'abstract type should changed')
  t.end()
})

function _addItem (metadataEditor, modelName) {
  // open the add drop down
  let addDropDown = metadataEditor.find('.sc-tool-dropdown.sm-insert')
  addDropDown.find('button').click()
  addDropDown.find('.sc-tool.sm-insert-' + modelName).click()
}

function _isToolEnabled (editor, toolClass) {
  return isToolEnabled(editor, 'context-tools', toolClass)
}
