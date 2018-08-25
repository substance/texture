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
  // check if the modal with a workflow got opened
  let workflow = articlePanel.find('.se-workflow-modal')
  t.notNil(workflow, 'There should be a workflow in modal')
  t.end()
})
