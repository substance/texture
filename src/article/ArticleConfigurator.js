import { AnnotationCommand, platform, SwitchTextTypeCommand } from 'substance'
import TextureConfigurator from '../TextureConfigurator'
import NumberedLabelGenerator from './shared/NumberedLabelGenerator'
import InternalArticleSchema from './InternalArticleSchema'

export default class ArticleConfigurator extends TextureConfigurator {
  constructor () {
    super()

    this.config.models = {}
    this.schema = InternalArticleSchema
  }

  addNode () {
    throw new Error('Texture Article Schema is final and can no be extended.')
  }

  addAnnotationTool (spec) {
    let Command = spec.command || AnnotationCommand
    this.addCommand(spec.name, Command, {
      nodeType: spec.nodeType,
      commandGroup: spec.commandGroup
    })
    this.addIcon(spec.name, { 'fontawesome': spec.icon })
    this.addLabel(spec.name, spec.label)
    if (spec.accelerator) {
      this.addKeyboardShortcut(spec.accelerator, { command: spec.name })
    }
  }

  addTextTypeTool (spec) {
    this.addCommand(spec.name, SwitchTextTypeCommand, {
      spec: spec.nodeSpec,
      commandGroup: 'text-types'
    })
    this.addIcon(spec.name, { 'fontawesome': spec.icon })
    this.addLabel(spec.name, spec.label)
    if (spec.accelerator) {
      this.addKeyboardShortcut(spec.accelerator, { command: spec.name })
    }
  }

  setPanelsSpec (panelsSpec) {
    this.config.panelsSpec = panelsSpec
  }

  getPanelsSpec () {
    return this.config.panelsSpec
  }

  // see NumberedLabelGenerator
  setLabelGenerator (type, spec) {
    if (!this.config.labelGenerator) {
      this.config.labelGenerator = {}
    }
    this.config.labelGenerator[type] = spec
  }

  getLabelGenerator (type) {
    let config
    if (this.config.labelGenerator) {
      config = this.config.labelGenerator[type] || {}
    }
    return new NumberedLabelGenerator(config)
  }

  getKeyboardShortcuts () {
    return this.config.keyboardShortcuts
  }

  /*
    Allows lookup of a keyboard shortcut by command name
  */
  getKeyboardShortcutsByCommandName (commandName) {
    let keyboardShortcuts = {}
    this.config.keyboardShortcuts.forEach((entry) => {
      if (entry.spec.command) {
        let shortcut = entry.key.toUpperCase()

        if (platform.isMac) {
          shortcut = shortcut.replace(/CommandOrControl/i, '⌘')
          shortcut = shortcut.replace(/Ctrl/i, '^')
          shortcut = shortcut.replace(/Shift/i, '⇧')
          shortcut = shortcut.replace(/Enter/i, '↵')
          shortcut = shortcut.replace(/Alt/i, '⌥')
          shortcut = shortcut.replace(/\+/g, '')
        } else {
          shortcut = shortcut.replace(/CommandOrControl/i, 'Ctrl')
        }

        keyboardShortcuts[entry.spec.command] = shortcut
      }
    })
    return keyboardShortcuts[commandName]
  }
}
