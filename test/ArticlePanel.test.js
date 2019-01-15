import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { openManuscriptEditor, openMetadataEditor } from './shared/integrationTestHelpers'

const SWITCH_MODE_TOOL_DROPDOWN_SELECTOR = '.sc-tool-dropdown.sm-mode'

test('ArticlePanel: open every view', t => {
  let { app } = setupTestApp(t)
  openManuscriptEditor(app)
  openMetadataEditor(app)
  t.pass('ArticlePanel should be able to open all views without errors.')
  t.end()
})

test('ArticlePanel: using switch view', t => {
  let { app } = setupTestApp(t)
  openManuscriptEditor(app)
  let dropdown = app.find(SWITCH_MODE_TOOL_DROPDOWN_SELECTOR)
  dropdown.find('button.se-toggle').click()
  openMetadataEditor(app)
  dropdown.find('button.sm-open-metadata').click()
  let metadataEditor = app.find('.sc-metadata-editor')
  t.notNil(metadataEditor, 'metadata editor should be displayed now')
  t.equal(metadataEditor.context.appState.viewName, 'metadata', 'appState.viewName should be correct')
  t.end()
})
