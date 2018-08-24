import { testAsync } from './testHelpers'
import setupTestApp from './setupTestApp'

testAsync('Add Reference: TODO do serious stuff here', async (t) => {
  let { app } = await setupTestApp(t)
  let articlePanel = app.find('.sc-article-panel')
  // open the metadata panel
  articlePanel.send('updateViewName', 'metadata')
  // open the add drop down
  let addDropDown = articlePanel.find('.sc-tool-dropdown.sm-add')
  addDropDown.find('.se-toggle').click()
  // click on the add-reference button
  // TODO: implement a different check
  // ATM this click raises an exception, which unfortunately does not yield an exception because the browser consumes exceptions on clicks
  // but there is not result in that case
  let res = addDropDown.find('.sm-add-reference').click()
  // TODO: continue here
  t.ok(Boolean(res))
  t.end()
})
