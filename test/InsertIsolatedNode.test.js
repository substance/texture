import { test } from 'substance-test'
import { getDocument, loadBodyFixture, setCursor, openManuscriptEditor } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

// TODO: explain why this test was added? Is it about general insertion of certain nodes?
// IMO this should be moved into ManuscriptEditor.test

// TODO: 'tools' is not a good name
// this looks like a 'SPECS' maybe
// constants should be written in capitals
const tools = {
  'disp-formula': {
    label: 'Formula',
    nodeType: 'block-formula'
  },
  'disp-quote': {
    label: 'Blockquote',
    nodeType: 'block-quote'
  },
  'table': {
    label: 'Table',
    nodeType: 'table-figure'
  }
}

const emptyFixture = `<p id="p1"></p>`

Object.keys(tools).forEach(tool => {
  // TODO: the title could be better. IsoloatedNode is an internal concept.
  // What is actually done here, is inserting certain node types into an otherwise empty body
  test(`Insert Isolated node to empty document: ${tools[tool].label}`, t => {
    testEmptyBodyIsolationNodeInsertion(t, tools[tool], tool)
  })
})

function testEmptyBodyIsolationNodeInsertion (t, tool, toolId) {
  // TODO: the tests/checks could be more targeted. We should not check for everything everywhere.
  // A test should focus on a certain aspect and test only that.
  let { doc, editor } = _setupEmptyEditor(t)
  t.equal(isToolActive(editor, toolId), false, 'Tool must be disabled')
  setCursor(editor, 'p1.content', 0)
  t.equal(isToolActive(editor, toolId), true, 'Tool must be active')
  t.equal(doc.get('body').length, 1, 'Body should be not empty')
  let firstEl = doc.get('body').getNodeAt(0)
  t.equal(firstEl.type, 'paragraph', 'First element should be paragraph')
  openInsertMenu(editor)
  let insertBtn = editor.find('.sc-menu-item.sm-insert-' + toolId)
  insertBtn.click()
  t.equal(doc.get('body').length, 1, 'Body should be not empty')
  let inserrtedEl = doc.get('body').getNodeAt(0)
  t.equal(inserrtedEl.type, tool.nodeType, 'First element should be ' + tool.nodeType)
  let undoBtn = editor.find('.sc-toggle-tool.sm-undo button')
  t.equal(!!undoBtn.getAttribute('disabled'), false, 'Undo tool should be active')
  undoBtn.click()
  t.end()
}

function _setupEmptyEditor (t) {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  loadBodyFixture(editor, emptyFixture)
  return { doc, editor }
}

function isToolActive (el, toolId) {
  openInsertMenu(el)
  const toolBtn = el.find('.sc-menu-item.sm-insert-' + toolId)
  return !toolBtn.getAttribute('disabled')
}

function openInsertMenu (el) {
  const insertDropdown = el.find('.sc-tool-dropdown.sm-insert .sc-button')
  // Check if dropdown is already active
  const isDropDownOpened = insertDropdown.hasClass('sm-active')
  if (!isDropDownOpened) {
    insertDropdown.click()
  }
}
