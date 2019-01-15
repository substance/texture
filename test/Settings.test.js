import { test } from 'substance-test'
import { openManuscriptEditor, loadBodyFixture, getApi } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

const BODY_COMPONENT_SELECTOR = '[data-id="body.content"]'

const FIXTURE = `
  <p id="p1">ABC</p>
  <p id="p2">DEF</p>
  <p id="p3">GHI</p>
`

test('Settings: disable body container editing', t => {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
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
