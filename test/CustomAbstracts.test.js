import { test } from 'substance-test'
import {
  getDocument, insertText, openMetadataEditor,
  openContextMenuAndFindTool, isToolEnabled, setCursor, ensureAllFieldsVisible,
  createJATSFixture, createTestVfs, canSwitchTextTypeTo, switchTextType
} from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

const customAbstractSelector = '.sc-custom-abstract'
const customAbstractContentEditorSelector = '.sc-custom-abstract > .sm-content > .se-editor'
const moveDownToolSelector = '.sm-move-down-custom-abstract'
const moveUpToolSelector = '.sm-move-up-custom-abstract'
const removeToolSelector = '.sm-remove-custom-abstract'
const _getCustomAbstracts = editor => editor.findAll(customAbstractSelector)
const _selectCustomAbstractCard = card => card.click()
const _selectCard = (editor, id) => editor.find(`.sc-card[data-id="${id}"]`).click()
const _isMoveDownToolPossible = editor => isToolEnabled(editor, 'context-tools', moveDownToolSelector)
const _isMoveUpToolPossible = editor => isToolEnabled(editor, 'context-tools', moveUpToolSelector)
const _isRemovePossible = editor => isToolEnabled(editor, 'context-tools', removeToolSelector)
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

const META_WITH_ONE_EXECUTIVE_SUMMARY = `
<article-meta>
  <title-group>
    <article-title></article-title>
  </title-group>
  <abstract abstract-type="executive-summary" id="executive-summary">
    <title>Executive Summary</title>
    <p>This is an executive summary.</p>
  </abstract>
</article-meta>
`
const ARTICLE_WITH_ONE_EXECUTIVE_SUMMARY = createJATSFixture({ front: META_WITH_ONE_EXECUTIVE_SUMMARY })

test(`Custom Abstracts: removing a custom abstract`, t => {
  let { app } = setupTestApp(t, {
    vfs: createTestVfs(ARTICLE_WITH_ONE_EXECUTIVE_SUMMARY),
    archiveId: 'test'
  })
  let editor = openMetadataEditor(app)
  t.equal(editor.findAll(customAbstractSelector).length, 1, 'there should be one custom abstract')
  _selectCard(editor, 'executive-summary')
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
  _selectCustomAbstractCard(_getCustomAbstracts(editor)[0])
  t.notOk(_isMoveUpToolPossible(editor), 'should not be possible to move up custom abstract')
  t.ok(_isMoveDownToolPossible(editor), 'should be possible to move down custom abstract')
  _moveDownAbstract(editor)
  t.ok(_isMoveUpToolPossible(editor), 'should be possible to move up custom abstract')
  t.notOk(_isMoveDownToolPossible(editor), 'should not be possible to move down custom abstract')
  t.end()
})

const META_WITH_EMPTY_CUSTOM_ABSTRACT = `
<article-meta>
  <title-group>
    <article-title></article-title>
  </title-group>
  <abstract abstract-type="" id="custom-abstract">
    <title></title>
    <p></p>
  </abstract>
</article-meta>
`
const ARTICLE_WITH_ONE_EMPTY_CUSTOM_ABSTRACT = createJATSFixture({ front: META_WITH_EMPTY_CUSTOM_ABSTRACT })

test('Custom Abstracts: editing title', t => {
  let { app } = setupTestApp(t, {
    vfs: createTestVfs(ARTICLE_WITH_ONE_EMPTY_CUSTOM_ABSTRACT),
    archiveId: 'test'
  })
  let editor = openMetadataEditor(app)
  let doc = getDocument(editor)
  const newTitle = 'Custom abstract title'
  _addItem(editor, 'custom-abstract')
  const customAbstracts = doc.get(['article', 'customAbstracts'])
  const customAbstractId = customAbstracts[0]
  t.equal(doc.get([customAbstractId, 'title']), '', 'title should be empty')
  ensureAllFieldsVisible(editor, customAbstractId)
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
  // TODO: instead of inserting a new item we should use a fixture
  _addItem(editor, 'custom-abstract')
  const customAbstracts = doc.get(['article', 'customAbstracts'])
  const customAbstractId = customAbstracts[0]
  t.equal(doc.get([customAbstractId, 'abstractType']), '', 'abstract type should be empty')
  _selectAbstractType(editor, customAbstractId, customAbstractType)
  t.equal(doc.get([customAbstractId, 'abstractType']), customAbstractType, 'abstract type should changed')
  t.end()
})

const META_WITH_MULTISECTION_SUMMARY = `
<article-meta>
  <title-group>
    <article-title></article-title>
  </title-group>
  <abstract abstract-type="executive-summary" id="executive-summary">
    <title>Executive Summary</title>
    <sec id="sec-1">
      <title>Part 1</title>
      <p id="p-1">First part content.</p>
      <sec id="sec-2">
        <title>Editors</title>
      </sec>
    </sec>
  </abstract>
</article-meta>
`
const ARTICLE_WITH_MULTISECTION_SUMMARY = createJATSFixture({ front: META_WITH_MULTISECTION_SUMMARY })

test(`Custom Abstracts: switching headings`, t => {
  let { app } = setupTestApp(t, {
    vfs: createTestVfs(ARTICLE_WITH_MULTISECTION_SUMMARY),
    archiveId: 'test'
  })
  let editor = openMetadataEditor(app)
  let abstractEditor = editor.find(customAbstractContentEditorSelector)
  t.equal(abstractEditor.findAll('h1').length, 1, 'there should be one heading level 1')
  t.equal(abstractEditor.findAll('h2').length, 1, 'there should be one heading level 2')
  setCursor(abstractEditor, 'sec-1.content', 0)
  t.ok(canSwitchTextTypeTo(editor, 'paragraph'), 'switch to paragraph should be possible')
  switchTextType(editor, 'paragraph')
  t.equal(abstractEditor.findAll('h1').length, 0, 'there should be no heading level 1')
  setCursor(abstractEditor, 'p-1.content', 0)
  t.ok(canSwitchTextTypeTo(editor, 'heading1'), 'switch to heading level 1 should be possible')
  switchTextType(editor, 'heading1')
  t.equal(abstractEditor.findAll('h1').length, 1, 'there should be one heading level 1')
  t.end()
})

function _addItem (metadataEditor, modelName) {
  // open the add drop down and click the according insert button
  let addDropDown = metadataEditor.find('.sc-tool-dropdown.sm-insert')
  addDropDown.find('button').click()
  addDropDown.find('.sc-tool.sm-insert-' + modelName).click()
}

function _selectAbstractType (editor, customAbstractId, abstractType) {
  const abstractTypeEditor = editor.find(`.sc-card[data-id="${customAbstractId}"] .sc-form-row.sm-abstractType .sc-dropdown-editor`)
  // HACK: the easiest way to achieve this is using the DropdownEditor hooks directly
  abstractTypeEditor.refs.input.setValue(abstractType)
  abstractTypeEditor._setValue()
}
