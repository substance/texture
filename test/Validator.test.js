import { test } from 'substance-test'
import { getApi, openMenuAndFindTool, startEditMetadata } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

const ADD_AUTHOR_SELECTOR = '.sm-add-author'

test('Validator: disable body container editing', t => {
  let { editor } = setupTestApp(t, { archiveId: 'blank' })
  let metadataEditor = startEditMetadata(editor)
  getApi(metadataEditor)._loadSettings({
    'person.givenNames': { required: true },
    'person.surname': { required: true }
  })
  openMenuAndFindTool(metadataEditor, 'insert', ADD_AUTHOR_SELECTOR).click()
  // there should be only two fields visible: givenNames, and surnace
  // the others being optional should be hidden away
  let personCard = editor.find('.sc-card.sm-person')
  let surnameField = personCard.find('.sc-form-row.sm-surname')
  t.ok(surnameField.hasClass('sm-warning'), 'surname field should have a warning')
  let givenNamesField = personCard.find('.sc-form-row.sm-givenNames')
  t.ok(givenNamesField.hasClass('sm-warning'), 'givenNames field should have a warning')
  t.end()
})
