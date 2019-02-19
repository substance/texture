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

  _deriveState (props) {
    if (this._isTopLevel) {
      this._derivedState = this._deriveGroupState(this.props, this.props.commandStates)
    }
  }

  render ($$) {
    const { name } = this.props
    let el = $$('div')
      .addClass(this._getClassNames())
      .addClass('sm-' + name)

    return el
  }

  _renderContent ($$) {
    const { hideDisabled } = this.props
    let els = []
    let hasEnabledItem = this._derivedState.hasEnabledItem
    if (hasEnabledItem || !hideDisabled) {
      els.push(this._renderLabel($$))
      els.push(this._renderItems($$))
    }
  }

  _renderLabel () {
    // Note: only in MenuGroups this is implemented
    // TODO: maybe we should instead override _renderContent() in MenuGroup
  }

  _renderItems ($$) {
    const { style, theme, hideDisabled, commandStates } = this.props
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
        case 'group': {
          let ToolClass = this._getToolClass(item)
          els.push(
            $$(ToolClass, Object.assign({}, item, {
              commandStates,
              theme
            })).ref(item.name)
          )
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
          console.warn('Unsupported item type', item.type)
        }
      }
    }
    return els
  }

  get _isTopLevel () { return false }

  // ATTENTION: this is only called for top-level tool groups (Menu, Prompt, ) which are ToolDrop
  _deriveGroupState (group, commandStates) {
    let itemStates = group.items.map(item => this._deriveItemState(item, commandStates))
    let hasEnabledItem = itemStates.some(item => item.enabled)
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
          enabeld: !commandState.disabled
        }
      }
      case 'group': {
        return this._deriveGroupState(item, commandStates)
      }
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
