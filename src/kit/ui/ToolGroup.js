import { Component } from 'substance'

const DISABLED = { disabled: true }

/**
 * A component that renders a group of tools.
 *
 * @param {string} props.name
 * @param {string} props.style
 * @param {string} props.theme
 * @param {boolean} props.hideDisabled
 * @param {array} props.items array of item specifications
 * @param {object} props.commandStates command states by name
 */
export default class ToolGroup extends Component {
  render ($$) {
    const {
      name, style, theme, hideDisabled,
      items, commandStates
    } = this.props

    let el = $$('div')
      .addClass(this._getClassNames())
      .addClass('sm-' + name)

    for (let item of items) {
      // TODO: should we show separators?
      let type = item.type
      if (type === 'command') {
        const commandName = item.name
        let commandState = commandStates[commandName] || DISABLED
        // TODO: why is it necessary to override isToolEnabled()?
        if (!hideDisabled || this.isToolEnabled(commandState, item)) {
          let ToolClass = this._getToolClass(type)
          el.append(
            $$(ToolClass, {
              item,
              commandState,
              style,
              theme
            }).ref(commandName)
          )
        }
      }
    }

    return el
  }

  /*
    Determine whether a tool should be shown or not
  */
  isToolEnabled (commandState, opts = {}) {
    return (commandState && !commandState.disabled)
  }

  /*
    Returns true if at least one command is enabled
  */
  hasEnabledTools (commandStates) {
    if (!commandStates) {
      commandStates = this.props.commandStates
    }
    let items = this.props.items
    for (let item of items) {
      let commandState = commandStates[item.commandName]
      if (this.isToolEnabled(commandState, item)) return true
    }
    return false
  }

  _getClassNames () {
    return 'sc-tool-group'
  }

  _getToolClass (item) {
    // use an ToolClass from toolSpec if configured inline in ToolGroup spec
    let ToolClass = item.ToolClass
    // next try if there is a tool registered by the name
    if (!ToolClass) {
      ToolClass = this.context.toolRegistry.get(item.name)
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
