import { test } from 'substance-test'
import { setCursor, openManuscriptEditor, PseudoFileEvent, getEditorSession, loadBodyFixture, getDocument } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

const SUPPLEMENT_FILE = `
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
