import { test } from 'substance-test'
import { Command } from 'substance'
import { Texture } from '../index'
import setupTestApp from './shared/setupTestApp'
import { openManuscriptEditor, openMenuAndFindTool } from './shared/integrationTestHelpers'
import { spy } from './shared/testHelpers'

// TODO: most of the functionality is covered by regular tests, still it would be better
// to cover some functionality explicitly
// For now, we only test Configurator API, that is not used by the default Texture configuration

test('Configurator: register a plugin', t => {
  let testPlugin = {
    name: 'test-plugin',
    configure (configurator) {}
  }
  spy(testPlugin, 'configure')
  Texture.registerPlugin(testPlugin)
  setupTestApp(t, { archiveId: 'blank' })
  t.ok(testPlugin.configure.callCount === 1, 'test plugin should have been called during configuration')
  t.end()

  Texture.plugins.delete('test-plugin')
})

test('Configurator: extend the toolbar', t => {
  let testPlugin = {
    name: 'test-plugin',
    configure (configurator) {
      let MyCommand = class MyCommand extends Command {
        getCommandState () { return { disabled: false } }
      }
      let articleManuscriptConfig = configurator.getConfiguration('article.manuscript')
      articleManuscriptConfig.addCommand('test', MyCommand, { commandGroup: 'test' })
      articleManuscriptConfig.extendToolPanel('toolbar', toolPanelConfig => {
        let contextTools = toolPanelConfig.find(group => group.name === 'context-tools')
        if (contextTools) {
          contextTools.items.push({
            type: 'group',
            name: 'test',
            style: 'descriptive',
            label: 'test-tools',
            items: [
              { type: 'command-group', name: 'test' }
            ]
          })
        }
      })
    }
  }
  Texture.registerPlugin(testPlugin)
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let testTool = openMenuAndFindTool(editor, 'context-tools', '.sm-test')
  t.notNil(testTool, 'test tool should be displayed in context-tools menu')
  t.end()

  Texture.plugins.delete('test-plugin')
})
