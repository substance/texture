import ToolGroup from './ToolGroup'
import Tooltip from './Tooltip'

// TODO: use OverlayMixin to avoid code redundancy
export default class ToolDropdown extends ToolGroup {
  constructor (...args) {
    super(...args)

    this._derivedState = {}
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
    const hasEnabledTools = this._derivedState.hasEnabledTools
    const showChoices = appState.overlayId === this.getId()
    const style = this.props.style
    const theme = this.props.theme

    let el = $$('div').addClass('sc-tool-dropdown')
    el.addClass('sm-' + this.props.name)

    if (!hasEnabledTools) {
      el.addClass('sm-disabled')
    } else if (showChoices) {
      el.addClass('sm-open')
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
        .on('click', this._onClick)
        // ATTENTION: we need to preventDefault on mousedown, otherwise
        // native DOM selection disappears
        .on('mousedown', this._onMousedown)
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
    let hasEnabledTools = this.hasEnabledTools(props.commandStates)
    let activeCommandName
    if (this.props.displayActiveCommand) {
      activeCommandName = this._getActiveCommandName(props.items, props.commandStates)
    }
    this._derivedState = {
      activeCommandName,
      hasEnabledTools
    }
  }

  _getActiveCommandName (items, commandStates) {
    // FIXME: getting an active commandName does only make sense for a flat dropdown
    for (let item of items) {
      if (item.type === 'command') {
        const commandName = item.name
        let commandState = commandStates[commandName]
        if (commandState && commandState.active) {
          return commandName
        }
      }
    }
  }

  _getToggleName () {
    if (this.props.displayActiveCommand) {
      return this._derivedState.activeCommandName || this.props.name
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
        return (item.type !== 'command' || this._isToolEnabled(commandStates[item.name], item))
      })
    } else {
      items = this.props.items
    }
    return items
  }

  _onMousedown (event) {
    event.preventDefault()
  }

  _onClick (event) {
    event.preventDefault()
    event.stopPropagation()
    this.send('toggleOverlay', this.getId())
  }
}
