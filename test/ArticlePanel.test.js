import { testAsync } from './testHelpers'
import setupTestApp from './setupTestApp'

testAsync('ArticlePanel: open every view', async (t) => {
  let { app } = await setupTestApp(t)
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
