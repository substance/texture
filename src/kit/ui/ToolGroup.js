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
  constructor (...args) {
    super(...args)

    this._deriveState(this.props)
  }

  willReceiveProps (newProps) {
    this._deriveState(newProps)
  }

  getTheme () {
    // HACK: falling back to 'light' in a hard-coded way
    return this.props.theme || 'light'
  }

  _deriveState (props) {
    if (this._isTopLevel) {
      this._derivedState = this._deriveGroupState(props, props.commandStates)
    } else {
      this._derivedState = props.itemState
    }
  }

  render ($$) {
    const { name, hideDisabled } = this.props
    let el = $$('div')
      .addClass(this._getClassNames())
      .addClass('sm-' + name)

    let hasEnabledItem = this._derivedState.hasEnabledItem
    if (hasEnabledItem || !hideDisabled) {
      el.append(this._renderLabel($$))
      el.append(this._renderItems($$))
    }

    return el
  }

  _renderLabel ($$) {
    // EXPERIMENTAL: showing a ToolGroup label an
    const { style, label } = this.props
    if (style === 'descriptive' && label) {
      const SeparatorClass = this.getComponent('tool-separator')
      return $$(SeparatorClass, { label })
    }
  }

  _renderItems ($$) {
    const { style, hideDisabled, commandStates } = this.props
    const theme = this.getTheme()
    const { itemStates } = this._derivedState
    let els = []
    for (let itemState of itemStates) {
      let item = itemState.item
      let type = item.type
      switch (type) {
        case 'command': {
          const commandName = item.name
          let commandState = itemState.commandState
          if (itemState.enabled || !hideDisabled) {
            let ToolClass = this._getToolClass(item)
            els.push(
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
        case 'separator': {
          let ToolSeparator = this.getComponent('tool-separator')
          els.push(
            $$(ToolSeparator, item)
          )
          break
        }
        default: {
          let ToolClass = this._getToolClass(item)
          els.push(
            $$(ToolClass, Object.assign({}, item, {
              commandStates,
              itemState,
              theme
            })).ref(item.name)
          )
        }
      }
    }
    return els
  }

  get _isTopLevel () { return false }

  // ATTENTION: this is only called for top-level tool groups (Menu, Prompt, ) which are ToolDrop
  _deriveGroupState (group, commandStates) {
    let itemStates = group.items.map(item => this._deriveItemState(item, commandStates))
    let hasEnabledItem = itemStates.some(item => item.enabled || item.hasEnabledItem)
    return {
      item: group,
      itemStates,
      hasEnabledItem
    }
  }

  _deriveItemState (item, commandStates) {
    switch (item.type) {
      case 'command': {
        let commandState = commandStates[item.name] || DISABLED
        return {
          item,
          commandState,
          enabled: !commandState.disabled
        }
      }
      case 'group':
      case 'dropdown':
      case 'prompt':
      case 'switcher': {
        return this._deriveGroupState(item, commandStates)
      }
      case 'separator': {
        return { item }
      }
      default:
        throw new Error('Unsupported item type')
    }
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
          // try to use a tool registered by the same name as the command
          ToolClass = this.getComponent(item.name, 'no-throw')
          if (!ToolClass) {
            // using the default tool otherwise
            ToolClass = this.getComponent('tool')
          }
          break
        }
        case 'dropdown': {
          ToolClass = this.getComponent('tool-dropdown')
          break
        }
        case 'group': {
          ToolClass = this.getComponent('tool-group')
          break
        }
        case 'prompt': {
          ToolClass = this.getComponent('tool-prompt')
          break
        }
        case 'separator': {
          ToolClass = this.getComponent('tool-separator')
          break
        }
        // TODO: IMO this is a custom Tool, and should instead be used via ToolClass
        case 'switcher': {
          ToolClass = this.getComponent('tool-switcher')
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
