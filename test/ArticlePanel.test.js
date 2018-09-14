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
  t.doesNotThrow(() => {
    articlePanel.send('updateViewName', 'reader')
  })
  t.end()
})

test('ArticlePanel: no contenteditable in reader view', t => {
  let { app } = setupTestApp(t)
  let articlePanel = app.find('.sc-article-panel')
  articlePanel.send('updateViewName', 'reader')
  let editable = articlePanel.find('*[contenteditable=true]')
  t.nil(editable, 'There should be no editable element.')
  t.end()
})
