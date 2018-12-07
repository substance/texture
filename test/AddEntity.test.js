import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { openMetadataEditor } from './shared/integrationTestHelpers'

test(`AddEntity: add affiliation`, t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openMetadataEditor(app)
  // this should not throw
  // NOTE: this will only fail in the nodejs test suite, because browser runs the click
  // in a try-catch block (or so)
  t.doesNotThrow(() => {
    _addEntity(editor, 'organisation')
  })
  t.notNil(editor.find('.sc-card.sm-organisation'), 'there should be a card for the new entitiy')
  t.end()
})

function _addEntity (editor, type) {
  // open the corresponding dropdown
  let menu = editor.find('.sc-tool-dropdown.sm-add')
  menu.find('button').el.click()
  let addButton = menu.find(`.sc-menu-item.sm-add-${type}`).el
  return addButton.click()
}
