import { test } from 'substance-test'
import {
  setCursor, openManuscriptEditor, PseudoFileEvent,
  loadBodyFixture, openMenuAndFindTool
} from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

// TODO: test automatic labelling

const insertFigureSelector = '.sc-insert-figure-tool'

test('Figure: add figure', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  loadBodyFixture(editor, '<p id="p1">ABC</p>')
  setCursor(editor, 'p1.content', 3)
  // ATTENTION: it is not possible to trigger the file-dialog programmatically
  // instead we are just checking that this does not throw
  const insertFigureTool = openMenuAndFindTool(editor, 'insert', insertFigureSelector)
  t.ok(insertFigureTool.el.click(), 'clicking on the insert figure button should not throw error')
  // ... and then triggering onFileSelect() directly
  insertFigureTool.onFileSelect(new PseudoFileEvent())
  let afterP = editor.find('*[data-id=p1] + *')
  t.ok(afterP.hasClass('sm-figure'), 'element after p-2 should be a figure now')
  t.end()
})
