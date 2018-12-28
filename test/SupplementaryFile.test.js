import { test } from 'substance-test'
import { setCursor, openManuscriptEditor, PseudoFileEvent, getEditorSession, loadBodyFixture, getDocument } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

const SUPPLEMENT_FILE = `
  <p id="p1">ABC</p>
  <supplementary-material id="sm1">
    <label>Supplementary File 1</label>
    <caption id="sm1-caption">
      <p id="sm1-caption-p1">Description of Supplementary File</p>
    </caption>
  </supplementary-material>
`

test('Supplemetary File: insert to a manuscript', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)

  const insertSupplementaryFileToolSelector = '.sc-upload-supplementary-file-tool'
  const getInsertSupplementaryFileTool = () => editor.find(insertSupplementaryFileToolSelector + ' > button')

  loadBodyFixture(editor, '<p id="p1">ABC</p>')
  t.equal(getInsertSupplementaryFileTool().getAttribute('disabled'), 'true', 'tool shoud be disabled by default')
  setCursor(editor, 'p1.content', 2)
  t.isNil(getInsertSupplementaryFileTool().getAttribute('disabled'), 'tool shoud be enabled')

  t.doesNotThrow(() => {
    getInsertSupplementaryFileTool().el.click()
  }, 'using tool should not throw')
  t.doesNotThrow(() => {
    editor.find(insertSupplementaryFileToolSelector).onFileSelect(new PseudoFileEvent())
  }, 'triggering file upload should not throw')
  let afterP = editor.find('*[data-id=p1] + *')
  t.ok(afterP.hasClass('sm-supplementary-file'), 'element after p-1 should be a supplementary file now')
  t.end()
})

test('Supplementary File: remove from a manuscript', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let editorSession = getEditorSession(editor)
  let doc = getDocument(editor)
  loadBodyFixture(editor, SUPPLEMENT_FILE)
  t.notNil(editor.find('.sm-supplementary-file[data-id=sm1]'), 'supplementary file should be displayed in manuscript view')
  t.notNil(doc.get('sm1'), 'there should be sm1 node in document')
  editorSession.setSelection({
    type: 'node',
    nodeId: 'sm1',
    surfaceId: 'body',
    containerId: 'body'
  })
  editorSession.transaction((tx) => {
    tx.deleteSelection()
  })
  t.isNil(editor.find('.sm-supplementary-file[data-id=sm1]'), 'supplementary file should not be displayed in manuscript view anymore')
  t.isNil(doc.get('sm1'), 'there should be no node with sm1 id in document')
  // undo a supplementary file removing
  t.doesNotThrow(() => {
    editor.find('.sc-toggle-tool.sm-undo > button').el.click()
  }, 'using "Undo" should not throw')
  t.notNil(editor.find('.sm-supplementary-file[data-id=sm1]'), 'supplementary file should be again in manuscript view')
  const supplementartyFileNode = doc.get('sm1')
  t.notNil(supplementartyFileNode, 'supplementary file should be again in document')
  t.end()
})

test('Supplementary File: reference a file', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let editorSession = getEditorSession(editor)
  const supplementaryFileSelector = '.sc-isolated-node.sm-supplementary-file'
  const xrefSelector = '.sc-inline-node .sm-file'
  const emptyLabel = '???'
  const getXref = () => editor.find(xrefSelector)
  const insertSupplementaryFileToolSelector = '.sc-upload-supplementary-file-tool'
  const getInsertSupplementaryFileTool = () => editor.find(insertSupplementaryFileToolSelector + ' > button')

  loadBodyFixture(editor, SUPPLEMENT_FILE)
  t.equal(editor.findAll(supplementaryFileSelector).length, 1, 'there should be only one supplementary file in document')
  t.isNil(getXref(), 'there should be no references in manuscript')

  setCursor(editor, 'p1.content', 2)
  let citeMenu = editor.find('.sc-tool-dropdown.sm-cite button')
  citeMenu.click()
  let insertFileRef = editor.find('.sc-menu-item.sm-insert-xref-file')
  t.doesNotThrow(() => {
    insertFileRef.click()
  }, 'ref insertion should not throw')

  t.isNotNil(getXref(), 'there should be reference in manuscript')
  t.equal(getXref().text(), emptyLabel, 'xref label should not contain reference')

  getXref().click()
  const firstXref = editor.find('.sc-edit-xref-tool .se-option .sc-preview')
  firstXref.click()
  t.equal(getXref().text(), 'Supplementary File 1', 'xref label should be equal to supplementary file label')

  // insert another supplement before
  setCursor(editor, 'p1.content', 1)
  t.doesNotThrow(() => {
    getInsertSupplementaryFileTool().el.click()
  }, 'using tool should not throw')
  t.doesNotThrow(() => {
    editor.find(insertSupplementaryFileToolSelector).onFileSelect(new PseudoFileEvent())
  }, 'triggering file upload should not throw')
  t.equal(getXref().text(), 'Supplementary File 2', 'xref label should be equal to second supplementary file label')
  // remove the referenced supplement
  editorSession.setSelection({
    type: 'node',
    nodeId: 'sm1',
    surfaceId: 'body',
    containerId: 'body'
  })
  editorSession.transaction((tx) => {
    tx.deleteSelection()
  })
  t.equal(getXref().text(), emptyLabel, 'xref should be broken and contain empty label')
  t.end()
})

test('Supplementary File: replace a file', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let editorSession = getEditorSession(editor)
  loadBodyFixture(editor, SUPPLEMENT_FILE)

  const replaceSupplementaryFileToolSelector = '.sc-upload-supplementary-file-tool.sm-upload-tool'
  editorSession.setSelection({
    type: 'node',
    nodeId: 'sm1',
    surfaceId: 'body',
    containerId: 'body'
  })
  const replaceSupplementaryFileTool = editor.find(replaceSupplementaryFileToolSelector)
  t.isNotNil(replaceSupplementaryFileTool, 'replace supplementary file tool shoold be available')
  t.ok(replaceSupplementaryFileTool.find('button').click(), 'clicking on the replace supplementary file button should not throw error')
  t.doesNotThrow(() => {
    replaceSupplementaryFileTool.onFileSelect(new PseudoFileEvent())
  }, 'triggering file upload for replace supplementary file should not throw')

  t.end()
})
