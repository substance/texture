import { Configurator, merge, isString, flatten, includes, forEach } from 'substance'

export default class TextureConfigurator extends Configurator {
  constructor () {
    super()

    this.config.configurations = {}
    this.config.propertyEditors = []
    this._compiledToolPanels = {}
  }

  static createFrom (parentConfig) {
    let ConfiguratorClass = this
    let config = new ConfiguratorClass()
    merge(config, parentConfig)
    return config
  }

  createScope (name) {
    let ConfiguratorClass = this.constructor
    let scope = new ConfiguratorClass()
    this.setConfiguration(name, scope)
    return scope
  }

  setConfiguration (name, config) {
    this.config.configurations[name] = config

    config._name = this._name ? this._name + '/' + name : name
  }

  getConfiguration (name) {
    return this.config.configurations[name]
  }

  getComponentRegistry () {
    if (!this.componentRegistry) {
      this.componentRegistry = super.getComponentRegistry()
    }
    return this.componentRegistry
  }

  getComponent (name) {
    return this.getComponentRegistry().get(name, 'strict')
  }

  /*
    Map an XML node type to a model
  */
  addModel (modelType, ModelClass) {
    if (this.config.models[modelType]) {
      throw new Error(`model type ${modelType} already registered.`)
    }
    this.config.models[modelType] = ModelClass
  }

  getModelRegistry () {
    return this.config.models
  }

  addPropertyEditor (PropertyEditorClass) {
    if (includes(this.config.propertyEditors, PropertyEditorClass)) {
      throw new Error('Already registered')
    }
    this.config.propertyEditors.push(PropertyEditorClass)
  }

  getPropertyEditors () {
    return this.config.propertyEditors
  }

  addTool (name, ToolClass) {
    if (!isString(name)) {
      throw new Error("Expecting 'name' to be a String")
    }
    if (!ToolClass) {
      throw new Error('Provided nil for tool ' + name)
    }
    if (!ToolClass || !ToolClass.prototype._isTool) {
      throw new Error("Expecting 'ToolClass' to be of type Tool. name:", name)
    }

    this.config.tools[name] = ToolClass
  }

  getToolRegistry () {
    let result = new Map()
    forEach(this.config.tools, (ToolClass, name) => {
      result.set(name, ToolClass)
    })
    return result
  }

  getToolClass (name) {
    return this.config.tools[name]
  }

  addToolPanel (name, spec) {
    this.config.toolPanels[name] = spec
  }

  getToolPanel (name) {
    let toolPanelSpec = this.config.toolPanels[name]
    if (!toolPanelSpec) throw new Error('No toolpanel is registered by this name: ' + name)
    // return cache compiled tool-panels
    if (this._compiledToolPanels[name]) return this._compiledToolPanels[name]
    let toolPanel = toolPanelSpec.map(itemSpec => this._compileToolPanelItem(itemSpec))
    this._compiledToolPanels[name] = toolPanel
    return toolPanel
  }

  getCommands () {
    let commands = new Map()
    forEach(this.config.commands, (item, name) => {
      const Command = item.CommandClass
      let command = new Command(Object.assign({name: name}, item.options))
      commands.set(name, command)
    })
    return commands
  }

  getCommandGroup (name) {
    let commandGroup = this.config.commandGroups[name]
    if (!commandGroup) {
      console.warn('No command group registered by this name: ' + name)
      commandGroup = []
    }
    return commandGroup
  }

  _compileToolPanelItem (itemSpec) {
    let item = Object.assign({}, itemSpec)
    let type = itemSpec.type
    switch (type) {
      case 'command-group':
        return this.getCommandGroup(itemSpec.name).map(commandName => {
          return { commandName }
        })
      case 'tool-prompt':
      case 'tool-group':
      case 'tool-dropdown':
        item.items = flatten(itemSpec.items.map(itemSpec => this._compileToolPanelItem(itemSpec)))
        break
      case 'tool-separator':
        break
      default:
        throw new Error('Unsupported tool panel item type: ' + type)
    }
    return item
  }
}
