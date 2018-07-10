import { Component } from 'substance'

const DISABLED = { disabled: true }

/*
  A component that renders a group of tools.

  @param {string} props.name
  @param {boolean} props.showDisabled
  @param {string} props.style
  @param {string} props.theme
  @param {array} props.items array of item specifications
  @param {object} props.commandStates
*/
export default class ToolGroup extends Component {
  render ($$) {
    const {
      name, showDisabled, style, theme,
      items, commandStates
    } = this.props

    let el = $$('div')
      .addClass(this._getClassNames())
      .addClass('sm-' + name)

    items.forEach(toolSpec => {
      const commandName = toolSpec.commandName
      let commandState = commandStates[commandName] || DISABLED
      if (this.isToolEnabled(toolSpec, commandState) || showDisabled) {
        let ToolClass = this._getToolClass(toolSpec)
        el.append(
          $$(ToolClass, {
            commandName,
            name: commandName,
            commandState,
            style,
            theme
          }).ref(commandName)
        )
      }
    })

    return el
  }

  /*
    Determine wether a tool should be shown or not
  */
  isToolEnabled (toolSpec, commandState) {
    let disabled = (
      !commandState ||
      commandState.disabled ||
      (this.props.contextual && !toolSpec.showInContext)
    )
    return !disabled
  }

  /*
    Returns true if at least one command is enabled
  */
  hasEnabledTools (commandStates) {
    if (!commandStates) {
      commandStates = this.props.commandStates
    }
    let items = this.props.items
    for (let i = 0; i < items.length; i++) {
      let itemSpec = items[i]
      let commandState = commandStates[itemSpec.commandName]
      if (this.isToolEnabled(itemSpec, commandState)) return true
    }
    return false
  }

  _getClassNames () {
    return 'sc-tool-group'
  }

  _getToolClass (toolSpec) {
    // use an ToolClass from toolSpec if configured inline in ToolGroup spec
    let ToolClass = toolSpec.ToolClass
    // next try if there is a tool registered by the name
    if (!ToolClass) {
      ToolClass = this.context.configurator.getToolClass(toolSpec.commandName)
    }
    // after all fall back to default classes
    if (!ToolClass) {
      if (this.props.style === 'descriptive') {
        ToolClass = this.getComponent('menu-item')
      } else {
        ToolClass = this.getComponent('toggle-tool')
      }
    }
    return ToolClass
  }
}
