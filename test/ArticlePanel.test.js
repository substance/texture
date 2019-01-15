import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { openManuscriptEditor, openMetadataEditor } from './shared/integrationTestHelpers'

const SWITCH_MODE_DROPDOWN_SELECTOR = '.sc-tool-dropdown.sm-mode'
const TOGGLE_BUTTON_SELECTOR = 'button.se-toggle'
const OPEN_METADATA_OPTION_SELECTOR = 'button.sm-open-metadata'

test('ArticlePanel: open every view', t => {
  let { app } = setupTestApp(t)
  openManuscriptEditor(app)
  openMetadataEditor(app)
  t.pass('ArticlePanel should be able to open all views without errors.')
  t.end()
})

test('ArticlePanel: toggling switch view dropdown', t => {
  let { app } = setupTestApp(t)
  openManuscriptEditor(app)
  let dropdown = app.find(SWITCH_MODE_DROPDOWN_SELECTOR)
  // toggle once to open the dropdown
  dropdown.find('button.se-toggle').click()
  t.ok(dropdown.hasClass('sm-open'), 'dropdown should be open')
  // toggle again to close it
  dropdown.find('button.se-toggle').click()
  t.notOk(dropdown.hasClass('sm-open'), 'dropdown should be closed')
  t.end()
})

test('ArticlePanel: using switch view', t => {
  let { app } = setupTestApp(t)
  openManuscriptEditor(app)
  let dropdown = app.find(SWITCH_MODE_DROPDOWN_SELECTOR)
  dropdown.find(TOGGLE_BUTTON_SELECTOR).click()
  dropdown.find(OPEN_METADATA_OPTION_SELECTOR).click()
  let metadataEditor = app.find('.sc-metadata-editor')
  t.notNil(metadataEditor, 'metadata editor should be displayed now')
  t.equal(metadataEditor.context.appState.viewName, 'metadata', 'appState.viewName should be correct')
  t.end()
})
