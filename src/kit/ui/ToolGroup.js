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

    el.append(this._renderLabel($$))

    for (let item of items) {
      // TODO: should we show separators?
      let type = item.type
      switch (type) {
        case 'command': {
          const commandName = item.name
          let commandState = commandStates[commandName] || DISABLED
          // TODO: why is it necessary to override isToolEnabled()?
          if (!hideDisabled || this.isToolEnabled(commandState, item)) {
            let ToolClass = this._getToolClass(item)
            el.append(
              $$(ToolClass, {
                item,
                commandState,
                style,
                theme
              }).ref(commandName)
            )
          }
          break
        }
        case 'group': {
          let ToolClass = this._getToolClass(item)
          el.append(
            $$(ToolClass, Object.assign({}, item, {
              commandStates,
              theme
            })).ref(item.name)
          )
          break
        }
        default: {
          console.warn('Unsupported item type', item.type)
        }
      }
    }

    return el
  }

  _renderLabel () {
    // Note: only in MenuGroups this is implemented
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
      let commandState = commandStates[item.name]
      if (this.isToolEnabled(commandState, item)) return true
    }
    return false
  }

  _getClassNames () {
    return 'sc-tool-group'
  }

  _getToolClass (item) {
    // use an ToolClass from toolSpec if configured inline in ToolGroup spec
    let ToolClass
    if (item.ToolClass) {
      ToolClass = item.ToolClass
    } else {
      switch (item.type) {
        case 'command': {
          if (this.props.style === 'descriptive') {
            ToolClass = this.getComponent('menu-item')
          } else {
            ToolClass = this.getComponent('toggle-tool')
          }
          break
        }
        case 'group': {
          ToolClass = this.getComponent('tool-group')
          break
        }
        case 'separator': {
          ToolClass = this.getComponent('tool-separator')
          break
        }
        default: {
          console.error('Unsupported item type inside ToolGroup:', item.type)
        }
      }
    }

    return ToolClass
  }
}
