import ToolGroup from './ToolGroup'
import Tooltip from './Tooltip'

// TODO: use OverlayMixin to avoid code redundancy
export default class ToolDropdown extends ToolGroup {
  didMount () {
    this.context.appState.addObserver(['overlayId'], this.rerender, this, { stage: 'render' })
  }
  dispose () {
    this.context.appState.removeObserver(this)
  }
  render ($$) {
    const appState = this.context.appState
    const { commandStates, hideDisabled, style, theme } = this.props
    const toggleName = this._getToggleName()
    const hasEnabledTools = this._derivedState.hasEnabledTools
    const showChoices = appState.overlayId === this.getId()

    let el = $$('div').addClass('sc-tool-dropdown')
    el.addClass('sm-' + this.props.name)

    if (!hasEnabledTools) {
      el.addClass('sm-disabled')
    } else if (showChoices) {
      el.addClass('sm-open')
    }

    if (!hideDisabled || hasEnabledTools) {
      const Button = this.getComponent('button')
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
        el.append(
          $$('div').addClass('se-choices').append(
            this._renderItems($$)
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

  get _isTopLevel () {
    return true
  }

  _deriveState (props) {
    let derivedState = super._deriveState(props)
    if (this.props.displayActiveCommand) {
      derivedState.activeCommandName = this._getActiveCommandName(props.items, props.commandStates)
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

  _onMousedown (event) {
    event.preventDefault()
  }

  _onClick (event) {
    event.preventDefault()
    event.stopPropagation()
    this.send('toggleOverlay', this.getId())
  }
}
