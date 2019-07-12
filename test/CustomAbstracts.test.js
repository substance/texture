import { test } from 'substance-test'
import {
  getDocument, insertText,
  openContextMenuAndFindTool, isToolEnabled, setCursor, ensureAllFieldsVisible,
  createJATSFixture, createTestVfs, canSwitchTextTypeTo, switchTextType, ensureValidJATS, startEditMetadata, closeModalEditor
} from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

const customAbstractSelector = '.sc-card.sm-custom-abstract'
const customAbstractContentEditorSelector = '.sc-custom-abstract > .sm-content > .se-editor'
const moveDownToolSelector = '.sm-move-entity-down'
const moveUpToolSelector = '.sm-move-entity-up'
const removeToolSelector = '.sm-remove-entity'
const _getCustomAbstracts = editor => editor.findAll(customAbstractSelector)
const _selectCustomAbstractCard = card => card.el.emit('mousedown')
const _selectCard = (editor, id) => editor.find(`.sc-card[data-id="${id}"]`).el.emit('mousedown')
const _isMoveDownToolPossible = editor => isToolEnabled(editor, 'context-tools', moveDownToolSelector)
const _isMoveUpToolPossible = editor => isToolEnabled(editor, 'context-tools', moveUpToolSelector)
const _isRemovePossible = editor => isToolEnabled(editor, 'context-tools', removeToolSelector)
const _moveDownAbstract = editor => openContextMenuAndFindTool(editor, moveDownToolSelector).click()
const _removeAbstract = editor => openContextMenuAndFindTool(editor, removeToolSelector).click()

test(`CustomAbstracts: add a custom abstract`, t => {
  let { app, editor } = setupTestApp(t, { archiveId: 'blank' })

  let modalEditor = startEditMetadata(editor)
  _addCustomAbstract(modalEditor)
  t.equal(modalEditor.findAll(customAbstractSelector).length, 1, 'there should be one custom abstract')
  closeModalEditor(modalEditor)

  ensureValidJATS(t, app)
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

test(`CustomAbstracts: removing a custom abstract`, t => {
  let { editor } = setupTestApp(t, {
    vfs: createTestVfs(ARTICLE_WITH_ONE_EXECUTIVE_SUMMARY),
    archiveId: 'test'
  })
  let modalEditor = startEditMetadata(editor)
  _selectCard(modalEditor, 'executive-summary')
  t.ok(_isRemovePossible(modalEditor), 'should be possible to remove custom abstract')
  _removeAbstract(modalEditor)
  t.equal(modalEditor.findAll(customAbstractSelector).length, 0, 'there should be no custom abstract')
  t.end()
})

test('CustomAbstracts: move custom abstract', t => {
  let { editor, app } = setupTestApp(t, { archiveId: 'blank' })

  let modalEditor = startEditMetadata(editor)
  _addCustomAbstract(modalEditor)
  t.notOk(_isMoveUpToolPossible(modalEditor), 'should not be possible to move up custom abstract')
  t.notOk(_isMoveDownToolPossible(modalEditor), 'should not be possible to move down custom abstract')
  _addCustomAbstract(modalEditor)
  _selectCustomAbstractCard(_getCustomAbstracts(modalEditor)[0])
  t.notOk(_isMoveUpToolPossible(modalEditor), 'should not be possible to move up custom abstract')
  t.ok(_isMoveDownToolPossible(modalEditor), 'should be possible to move down custom abstract')
  _moveDownAbstract(modalEditor)
  t.ok(_isMoveUpToolPossible(modalEditor), 'should be possible to move up custom abstract')
  t.notOk(_isMoveDownToolPossible(modalEditor), 'should not be possible to move down custom abstract')
  closeModalEditor(modalEditor)

  ensureValidJATS(t, app)
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

test('CustomAbstracts: editing title', t => {
  let { app, editor } = setupTestApp(t, {
    vfs: createTestVfs(ARTICLE_WITH_ONE_EMPTY_CUSTOM_ABSTRACT),
    archiveId: 'test'
  })

  let modalEditor = startEditMetadata(editor)
  let modalDoc = getDocument(modalEditor)
  _addCustomAbstract(modalEditor)
  const newTitle = 'Custom abstract title'
  const customAbstracts = modalDoc.get(['article', 'customAbstracts'])
  const customAbstractId = customAbstracts[0]
  t.equal(modalDoc.get([customAbstractId, 'title']), '', 'title should be empty')
  ensureAllFieldsVisible(modalEditor, customAbstractId)
  setCursor(modalEditor, customAbstractId + '.title', 0)
  insertText(modalEditor, newTitle)
  t.equal(modalDoc.get([customAbstractId, 'title']), newTitle, 'title should have changed')
  closeModalEditor(modalEditor)

  ensureValidJATS(t, app)
  t.end()
})

test('CustomAbstracts: switching type', t => {
  let { app, editor } = setupTestApp(t, { archiveId: 'blank' })

  let modalEditor = startEditMetadata(editor)
  let modalDoc = getDocument(modalEditor)
  const customAbstractType = 'executive-summary'
  // TODO: instead of inserting a new item we should use a fixture
  _addCustomAbstract(modalEditor)
  const customAbstracts = modalDoc.get(['article', 'customAbstracts'])
  const customAbstractId = customAbstracts[0]
  t.equal(modalDoc.get([customAbstractId, 'abstractType']), '', 'abstract type should be empty')
  _selectAbstractType(modalEditor, customAbstractId, customAbstractType)
  t.equal(modalDoc.get([customAbstractId, 'abstractType']), customAbstractType, 'abstract type should changed')
  closeModalEditor(modalEditor)

  ensureValidJATS(t, app)
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

test(`CustomAbstracts: switching headings`, t => {
  let { app, editor } = setupTestApp(t, {
    vfs: createTestVfs(ARTICLE_WITH_MULTISECTION_SUMMARY),
    archiveId: 'test'
  })

  let modalEditor = startEditMetadata(editor)
  let abstractEditor = modalEditor.find(customAbstractContentEditorSelector)
  t.equal(abstractEditor.findAll('h1').length, 1, 'there should be one heading level 1')
  t.equal(abstractEditor.findAll('h2').length, 1, 'there should be one heading level 2')
  setCursor(abstractEditor, 'sec-1.content', 0)
  t.ok(canSwitchTextTypeTo(modalEditor, 'paragraph'), 'switch to paragraph should be possible')
  switchTextType(modalEditor, 'paragraph')
  t.equal(abstractEditor.findAll('h1').length, 0, 'there should be no heading level 1')
  setCursor(abstractEditor, 'p-1.content', 0)
  t.ok(canSwitchTextTypeTo(modalEditor, 'heading1'), 'switch to heading level 1 should be possible')
  switchTextType(modalEditor, 'heading1')
  t.equal(abstractEditor.findAll('h1').length, 1, 'there should be one heading level 1')
  closeModalEditor(modalEditor)

  ensureValidJATS(t, app)
  t.end()
})

function _addCustomAbstract (metadataEditor) {
  // open the add drop down and click the according insert button
  let addDropDown = metadataEditor.find('.sc-tool-dropdown.sm-insert')
  addDropDown.find('button').click()
  addDropDown.find('.sc-tool.sm-add-custom-abstract').click()
}

function _selectAbstractType (editor, customAbstractId, abstractType) {
  const abstractTypeEditor = editor.find(`.sc-card[data-id="${customAbstractId}"] .sc-form-row.sm-abstractType .sc-dropdown-editor`)
  // HACK: the easiest way to achieve this is using the DropdownEditor hooks directly
  abstractTypeEditor.refs.input.setValue(abstractType)
  abstractTypeEditor._setValue()
}
