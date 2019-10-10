import { Configurator, flatten, isArray } from 'substance'

export default class TextureConfigurator extends Configurator {
  constructor (...args) {
    super(...args)

    // Note: in Texture we use 'command-groups' to allow register
    // a commands in groups, which are then used in tool-panels.
    // When it comes to execution these groups need to be rolled out.
    this._compiledToolPanels = new Map()
  }

  getToolPanel (name, strict) {
    if (this._compiledToolPanels.has(name)) {
      return this._compiledToolPanels.get(name)
    }
    const toolPanelSpec = super.getToolPanel(name, strict)
    let compiledToolPanel
    if (isArray(toolPanelSpec)) {
      compiledToolPanel = toolPanelSpec.map(itemSpec => this._compileToolPanelItem(itemSpec))
    } else {
      compiledToolPanel = this._compileToolPanelItem(toolPanelSpec)
    }
    this._compiledToolPanels.set(name, compiledToolPanel)
    return compiledToolPanel
  }

  _compileToolPanelItem (itemSpec) {
    let item = Object.assign({}, itemSpec)
    let type = itemSpec.type
    switch (type) {
      case 'command': {
        if (!itemSpec.name) throw new Error("'name' is required for type 'command'")
        break
      }
      case 'command-group':
        return this.getCommandGroup(itemSpec.name).map(commandName => {
          return {
            type: 'command',
            name: commandName
          }
        })
      case 'prompt':
      case 'group':
      case 'dropdown':
        item.items = flatten(itemSpec.items.map(itemSpec => this._compileToolPanelItem(itemSpec)))
        break
      case 'custom':
      case 'separator':
      case 'spacer':
        break
      default:
        throw new Error('Unsupported tool panel item type: ' + type)
    }
    return item
  }
}
