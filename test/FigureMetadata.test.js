import { test } from 'substance-test'
import {
  getEditorSession, getSelection, loadBodyFixture, openContextMenuAndFindTool,
  openManuscriptEditor, openMetadataEditor, selectNode
} from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

const addCustomMetadataFieldToolSelector = '.sm-add-metadata-field'
const moveDownCustomMetadataFieldToolSelector = '.sm-move-down-metadata-field'
const moveUpCustomMetadataFieldToolSelector = '.sm-move-up-metadata-field'
const removeCustomMetadataFieldToolSelector = '.sm-remove-metadata-field'

const figureMetadataSelector = '.sc-custom-metadata-field'
const figureCustomMetadataFieldInputSelector = '.sc-custom-metadata-field .sc-string'
const figureCustomMetadataFieldNameSelector = '.sc-custom-metadata-field .se-field-name .se-input'

const FIXTURE = `
  <fig-group id="fig1">
    <fig id="fig1a">
      <graphic />
      <caption>
        <p id="fig1a-caption-p1"></p>
      </caption>
      <kwd-group>
        <label>Field I</label>
        <kwd>Value A</kwd>
        <kwd>Value B</kwd>
      </kwd-group>
    </fig>
  </fig-group>
`

test('Figure Metadata: open figure with custom fields in manuscript and metadata view', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, FIXTURE)
  t.notNil(editor.find(figureMetadataSelector), 'there should be a figure with metadata in manuscript')
  const fields = editor.findAll(figureCustomMetadataFieldInputSelector)
  t.equal(fields.length, 2, 'there should be two inputs')
  t.equal(fields[0].getTextContent(), 'Field I', 'shoud be keyword label inside first')
  t.equal(fields[1].getTextContent(), 'Value A, Value B', 'shoud be values joined with comma inside second')
  editor = openMetadataEditor(app)
  t.notNil(editor.find(figureMetadataSelector), 'there should be a figure with metadata in manuscript')
  t.end()
})

test('Figure Metadata: add a new custom field', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, FIXTURE)
  t.equal(editor.findAll(figureMetadataSelector).length, 1, 'there should be one custom field')
  _selectCustomField(editor)
  const addCustomMetadataFieldTool = openContextMenuAndFindTool(editor, addCustomMetadataFieldToolSelector)
  t.ok(addCustomMetadataFieldTool.click(), 'clicking on add custom field tool should not throw error')
  t.equal(editor.findAll(figureMetadataSelector).length, 2, 'there should be two custom fields now')
  const selectedNodePath = getSelection(editor).path
  const secondCustomFieldInputPath = editor.findAll(figureCustomMetadataFieldNameSelector)[1].getPath()
  t.deepEqual(selectedNodePath, secondCustomFieldInputPath, 'selection path and second custom field path should match')
  t.end()
})

test('Figure Metadata: add a new custom field when figure is selected', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, FIXTURE)
  t.equal(editor.findAll(figureMetadataSelector).length, 1, 'there should be one custom field')
  selectNode(editor, 'fig1')
  const addCustomMetadataFieldTool = openContextMenuAndFindTool(editor, addCustomMetadataFieldToolSelector)
  t.isNotNil(addCustomMetadataFieldTool, 'add custom field tool should be available for a figure selection')
  t.ok(addCustomMetadataFieldTool.click(), 'clicking on add custom field tool should not throw error')
  t.equal(editor.findAll(figureMetadataSelector).length, 2, 'there should be two custom fields now')
  const selectedNodePath = getSelection(editor).path
  const secondCustomFieldInputPath = editor.findAll(figureCustomMetadataFieldNameSelector)[1].getPath()
  t.deepEqual(selectedNodePath, secondCustomFieldInputPath, 'selection path and second custom field path should match')
  t.end()
})

test('Figure Metadata: remove custom field', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, FIXTURE)
  t.equal(editor.findAll(figureMetadataSelector).length, 1, 'there should be one custom field')
  _selectCustomField(editor)
  const removeCustomMetadataFieldTool = openContextMenuAndFindTool(editor, removeCustomMetadataFieldToolSelector)
  t.ok(removeCustomMetadataFieldTool.click(), 'clicking on remove custom field tool should not throw error')
  t.equal(editor.findAll(figureMetadataSelector).length, 0, 'there should be no custom fields now')
  t.end()
})

test('Figure Metadata: move custom field', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)

  const _getMoveUpCustomMetadataFieldTool = () => openContextMenuAndFindTool(editor, moveUpCustomMetadataFieldToolSelector)
  const _getMoveDownCustomMetadataFieldTool = () => openContextMenuAndFindTool(editor, moveDownCustomMetadataFieldToolSelector)
  const _getAddCustomMetadataFieldTool = () => openContextMenuAndFindTool(editor, addCustomMetadataFieldToolSelector)

  loadBodyFixture(editor, FIXTURE)
  t.equal(editor.findAll(figureMetadataSelector).length, 1, 'there should be one custom field')
  _selectCustomField(editor)
  t.isNil(_getMoveUpCustomMetadataFieldTool(), 'move up custom field tool should be unavailable for a figure panel with one custom field')
  t.isNil(_getMoveDownCustomMetadataFieldTool(), 'move down custom field tool should be unavailable for a figure panel with one custom field')
  // Add a new one should put a selection on latest item
  t.ok(_getAddCustomMetadataFieldTool().click(), 'clicking on add custom field tool should not throw error')
  t.isNil(_getMoveDownCustomMetadataFieldTool(), 'move down custom field tool should be unavailable when selection is on latest field')
  t.isNotNil(_getMoveUpCustomMetadataFieldTool(), 'move up custom field tool should be available when selection is on latest field')
  // Move up to a first item
  t.ok(_getMoveUpCustomMetadataFieldTool().click(), 'clicking on move up custom field tool should not throw error')
  t.isNotNil(_getMoveDownCustomMetadataFieldTool(), 'move down custom field tool should be available when selection is on first field')
  t.isNil(_getMoveUpCustomMetadataFieldTool(), 'move up custom field tool should be unavailable when selection is on first field')
  // Add a new one should put a selection on latest item
  t.ok(_getAddCustomMetadataFieldTool().click(), 'clicking on add custom field tool should not throw error')
  // Move up to a second item
  t.ok(_getMoveUpCustomMetadataFieldTool().click(), 'clicking on move up custom field tool should not throw error')
  t.isNotNil(_getMoveUpCustomMetadataFieldTool(), 'move up custom field tool should be available when selection is not on the latest field')
  t.isNotNil(_getMoveDownCustomMetadataFieldTool(), 'move down custom field tool should be available when selection is not on the first field')
  // Move down to a latest item
  t.ok(_getMoveDownCustomMetadataFieldTool().click(), 'clicking on move down custom field tool should not throw error')
  t.isNil(_getMoveDownCustomMetadataFieldTool(), 'move down custom field tool should be unavailable again')
  t.isNotNil(_getMoveUpCustomMetadataFieldTool(), 'move up custom field tool should be available again')
  t.end()
})

// Puts a selection on a N-th custom fields
function _selectCustomField (el, pos) {
  pos = pos || 0
  const customFieldEl = el.findAll(figureMetadataSelector)[pos]
  const surfaceEl = customFieldEl.find('.sc-surface')
  const surfaceId = surfaceEl.getSurfaceId()
  const path = surfaceEl.getPath()
  let editorSession = getEditorSession(el)
  editorSession.setSelection({
    type: 'property',
    path,
    surfaceId,
    startOffset: 0
  })
}
