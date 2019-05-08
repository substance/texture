import { test } from 'substance-test'
import { Texture } from '../index'
import setupTestApp from './shared/setupTestApp'
import { } from './shared/integrationTestHelpers'
import { spy } from './shared/testHelpers'

// TODO: most of the functionality is covered by regular tests, still it would be better
// to cover some functionality explicitly
// For now, we only test Configurator API, that is not used by the default Texture configuration
test('Configurator: registering a plugin', t => {
  let testPlugin = {
    name: 'test-plugin',
    configure (configurator) {}
  }
  spy(testPlugin, 'configure')
  Texture.registerPlugin(testPlugin)
  setupTestApp(t, { archiveId: 'blank' })
  t.ok(testPlugin.configure.callCount === 1, 'test plugin should have been called during configuration')
  t.end()
})
