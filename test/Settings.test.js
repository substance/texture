import { test } from 'substance-test'
import { loadBodyFixture, getApi, openMenuAndFindTool, startEditMetadata } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

const BODY_COMPONENT_SELECTOR = '[data-id="body.content"]'
const ADD_AUTHOR_SELECTOR = '.sm-add-author'

const FIXTURE = `
  <p id="p1">ABC</p>
  <p id="p2">DEF</p>
  <p id="p3">GHI</p>
`

test('Settings: disable body container editing', t => {
  let { editor } = setupTestApp(t, { archiveId: 'blank' })
  loadBodyFixture(editor, FIXTURE)
  // by default, the body should be a container editor
  let bodyComponent = editor.find(BODY_COMPONENT_SELECTOR)
  t.ok(bodyComponent.hasClass('sc-container-editor'), 'body should be a container editor')
  getApi(editor)._loadSettings({
    'body.content': { container: false }
  })
  bodyComponent = editor.find(BODY_COMPONENT_SELECTOR)
  t.notOk(bodyComponent.hasClass('sc-container-editor'), 'body should not be a container editor')
  t.end()
})

test('Settings: defining required fields', t => {
  let { editor } = setupTestApp(t, { archiveId: 'blank' })
  let metadataEditor = startEditMetadata(editor)
  getApi(metadataEditor)._loadSettings({
    'person.givenNames': { required: true },
    'person.surname': { required: true }
  })
  openMenuAndFindTool(metadataEditor, 'insert', ADD_AUTHOR_SELECTOR).click()
  // there should be only two fields visible: givenNames, and surnace
  // the others being optional should be hidden away
  let personCard = metadataEditor.find('.sc-card.sm-person')
  let fields = personCard.findAll('.sc-form-row')
  t.equal(fields.length, 2, 'there should be two fields')
  t.end()
})
