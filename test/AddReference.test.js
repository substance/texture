import { testAsync } from './testHelpers'
import setupTestApp from './setupTestApp'

testAsync('Add Reference: TODO do serious stuff here', async (t) => {
  let { app } = await setupTestApp(t)
  let articlePanel = app.find('.sc-article-panel')
  // open the metadata panel
  articlePanel.send('updateViewName', 'metadata')
  // open the add drop down
  let addDropDown = articlePanel.find('.sc-tool-dropdown.sm-add')
  addDropDown.find('button').click()
  // click on the add-reference button
  addDropDown.find('.sc-menu-item.sm-add-reference').click()
  // TODO: continue here
  t.ok(Boolean(res))
  t.end()
})
