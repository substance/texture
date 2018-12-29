import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'

test('ArticlePanel: open every view', t => {
  let { app } = setupTestApp(t)
  let articlePanel = app.find('.sc-article-panel')
  t.doesNotThrow(() => {
    articlePanel.send('updateViewName', 'manuscript')
  })
  t.doesNotThrow(() => {
    articlePanel.send('updateViewName', 'metadata')
  })
  t.end()
})
