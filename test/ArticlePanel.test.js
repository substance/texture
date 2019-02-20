import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { openManuscriptEditor, openMetadataEditor } from './shared/integrationTestHelpers'

const SWITCH_MODE_DROPDOWN_SELECTOR = '.sc-tool-switcher.sm-mode'
const OPEN_METADATA_OPTION_SELECTOR = 'button.sm-open-metadata'

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
  let switcher = app.find(SWITCH_MODE_DROPDOWN_SELECTOR)
  switcher.find(OPEN_METADATA_OPTION_SELECTOR).click()
  let metadataEditor = app.find('.sc-metadata-editor')
  t.notNil(metadataEditor, 'metadata editor should be displayed now')
  t.equal(metadataEditor.context.appState.viewName, 'metadata', 'appState.viewName should be correct')
  t.end()
})

// this should trigger disposal code
test('ArticlePanel: open and close every view', t => {
  let { app } = setupTestApp(t)
  openManuscriptEditor(app)
  openMetadataEditor(app)
  openManuscriptEditor(app)
  t.pass('ArticlePanel should be able to open all views without errors.')
  let articlePanel = app.find('.sc-article-panel')
  articlePanel.dispose()
  t.pass('ArticlePanel should dispose without errors.')
  t.end()
})

// Note: this test just cause the routing related code to be run
// I do not yet have an idea how to test that the particular element
// has been scrolled into the view
test('ArticlePanel: routing', t => {
  let { app } = setupTestApp(t)
  let articlePanel = app.find('.sc-article-panel')

  t.comment('switching to metadata view')
  articlePanel._onRouteChange({ viewName: 'metadata' })
  t.equal(articlePanel.state.viewName, 'metadata', 'metadata view should have been opened')

  t.comment('switching to manuscript view')
  articlePanel._onRouteChange({ viewName: 'manuscript' })
  t.equal(articlePanel.state.viewName, 'manuscript', 'manuscript view should have been opened')

  t.comment('scrolling to a section in metadata view')
  articlePanel._onRouteChange({ viewName: 'metadata', section: 'authors' })
  t.equal(articlePanel.state.viewName, 'metadata', 'metadata view should have been opened')
  // TODO: how to test this?

  t.comment('scrolling to a section in manuscript view')
  articlePanel._onRouteChange({ viewName: 'manuscript', section: 'footnotes' })
  t.equal(articlePanel.state.viewName, 'manuscript', 'manuscript view should have been opened')
  // TODO: how to test this?

  t.comment('scrolling to a node in metadata view')
  articlePanel._onRouteChange({ viewName: 'metadata', nodeId: 'fig1' })
  t.equal(articlePanel.state.viewName, 'metadata', 'metadata view should have been opened')
  // TODO: how to test this?

  t.comment('scrolling to a node in manuscript view')
  articlePanel._onRouteChange({ viewName: 'manuscript', nodeId: 'fig1' })
  t.equal(articlePanel.state.viewName, 'manuscript', 'manuscript view should have been opened')
  // TODO: how to test this?

  t.end()
})
