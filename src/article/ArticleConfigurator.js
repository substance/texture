import { AnnotationCommand, platform, SwitchTextTypeCommand } from 'substance'
import TextureConfigurator from '../TextureConfigurator'
import InternalArticleSchema from './InternalArticleSchema'
import ArticleHTMLExporter from './converter/html/ArticleHTMLExporter'
import ArticleHTMLImporter from './converter/html/ArticleHTMLImporter'
import ArticlePlainTextExporter from './converter/ArticlePlainTextExporter'
import JATSExporter from './converter/JATSExporter'
import JATSImporter from './converter/JATSImporter'

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

  setLabelGenerator (resourceType, LabelGeneratorClass, config) {
    if (!this.config.labelGenerator) {
      this.config.labelGenerator = {}
    }
    this.config.labelGenerator[resourceType] = {
      LabelGeneratorClass,
      config
    }
  }

  getLabelGenerator (resourceType) {
    let spec = this.config.labelGenerator[resourceType]
    if (!spec) throw new Error(`No LabelGenerator specified for resource type ${resourceType}`)
    const LabelGenerator = spec.LabelGeneratorClass
    return new LabelGenerator(spec.config)
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

  getExporter (type) {
    switch (type) {
      case 'text': {
        if (!this._textExporter) {
          this._textExporter = new ArticlePlainTextExporter()
        }
        return this._textExporter
      }
      case 'html': {
        if (!this._htmlExporter) {
          this._htmlExporter = new ArticleHTMLExporter(this)
        }
        return this._htmlExporter
      }
      case 'jats': {
        if (!this._jatsExporter) {
          this._jatsExporter = new JATSExporter()
        }
        return this._jatsExporter
      }
    }
  }

  getImporter (type) {
    switch (type) {
      case 'html': {
        if (!this._htmlImporter) {
          this._htmlImporter = new ArticleHTMLImporter(this)
        }
        return this._htmlImporter
      }
      case 'jats': {
        if (!this._jatsImporter) {
          this._jatsImporter = new JATSImporter(this)
        }
        return this._jatsImporter
      }
    }
  }
}
