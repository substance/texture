import ToolGroup from './ToolGroup'
import Tooltip from './Tooltip'

// TODO: use OverlayMixin to avoid code redundancy
export default class ToolDropdown extends ToolGroup {
  constructor (...args) {
    super(...args)

    this._deriveState(this.props)
  }

  didMount () {
    this.context.appState.addObserver(['overlayId'], this.rerender, this, { stage: 'render' })
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }

  willReceiveProps (newProps) {
    this._deriveState(newProps)
  }

  render ($$) {
    const appState = this.context.appState
    const commandStates = this.props.commandStates
    const toggleName = this._getToggleName()
    const hideDisabled = this.props.hideDisabled
    const hasEnabledTools = this._hasEnabledTools
    const showChoices = appState.overlayId === this.getId()
    const style = this.props.style
    const theme = this.props.theme

    let el = $$('div').addClass('sc-tool-dropdown')
    el.addClass('sm-' + this.props.name)

    if (!hasEnabledTools) {
      el.addClass('sm-disabled')
    }

    if (!hideDisabled || hasEnabledTools) {
      const Button = this.getComponent('button')
      const Menu = this.getComponent('menu')
      let toggleButtonProps = {
        dropdown: true,
        active: showChoices,
        theme,
        // HACK: we are passing the command state allowing to render labels with template strings
        commandState: commandStates[toggleName]
      }
      if (style === 'minimal') {
        toggleButtonProps.icon = toggleName
      } else {
        toggleButtonProps.label = toggleName
      }
      let toggleButton = $$(Button, toggleButtonProps).ref('toggle')
        .addClass('se-toggle')
        .on('click', this._toggleChoices)
      el.append(toggleButton)

      if (showChoices) {
        const items = this._getItems()
        el.append(
          $$('div').addClass('se-choices').append(
            $$(Menu, {
              style,
              items,
              commandStates
            })
          )
        )
      } else if (style === 'minimal' || toggleName !== this.props.name) {
        // NOTE: tooltips are only rendered when explanation is needed
        el.append(
          this._renderToolTip($$)
        )
      }
    }
    return el
  }

  _renderToolTip ($$) {
    let labelProvider = this.context.labelProvider
    return $$(Tooltip, {
      text: labelProvider.getLabel(this.props.name)
    })
  }

  _deriveState (props) {
    const commandStates = props.commandStates
    const items = props.items
    let activeCommandName
    let hasEnabledTools = false
    for (let item of items) {
      if (item.type === 'command') {
        const commandName = item.name
        let commandState = commandStates[commandName] || { disabled: true }
        if (!activeCommandName && commandState.active) activeCommandName = commandName
        if (!commandState.disabled) hasEnabledTools = true
      }
    }
    this._activeCommandName = activeCommandName
    this._hasEnabledTools = hasEnabledTools
  }

  _getToggleName () {
    if (this.props.displayActiveCommand) {
      return this._activeCommandName || this.props.name
    } else {
      return this.props.name
    }
  }

  _getItems () {
    const hideDisabled = this.props.hideDisabled
    // TODO: this needs to be thought through
    // what about separators, nested dropdows or groups?
    let items
    if (hideDisabled) {
      const commandStates = this.props.commandStates
      items = this.props.items.filter(item => {
        // ATTENTION: ATM with hideDisabled=true we only show enabled commands
        // i.e. no separatory, or nested groups or dropdowns
        return (item.type !== 'command' || this.isToolEnabled(commandStates[item.name], item))
      })
    } else {
      items = this.props.items
    }
    return items
  }

  _toggleChoices (event) {
    event.preventDefault()
    event.stopPropagation()
    this.send('toggleOverlay', this.getId())
  }
}
