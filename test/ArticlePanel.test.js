import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'

test('ArticlePanel: open every view', t => {
  let { app } = setupTestApp(t)
  let articlePanel = app.find('.sc-article-panel')
  articlePanel.send('updateViewName', 'manuscript')
  articlePanel.send('updateViewName', 'metadata')
  t.pass('ArticlePanel should be able to open all views without errors.')
  t.end()
})
