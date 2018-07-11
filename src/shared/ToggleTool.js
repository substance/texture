import { Component } from 'substance'
import Tooltip from './Tooltip'

/**
  @param {string} props.commandName
  @param {object} props.commandState
  @param {string} props.theme
  @param {string} props.keyboardShortcut
*/
export default class ToggleTool extends Component {
  render ($$) {
    let el = $$('div')
      .addClass('sc-toggle-tool')
      .addClass(this.getClassNames())
    el.append(
      this.renderButton($$)
    )
    el.append(
      $$(Tooltip, {
        text: this._getTooltipText()
      })
    )
    return el
  }

  renderButton ($$) {
    const { active, disabled } = this.props.commandState
    const Button = this.getComponent('button')
    let btn = $$(Button, {
      icon: this._getIconName(),
      active,
      disabled,
      theme: this.props.theme
    }).on('click', this.onClick)
    return btn
  }

  getClassNames () {
    return `sm-${this._getName()}`
  }

  onClick (e) {
    e.preventDefault()
    e.stopPropagation()
    if (!this.props.commandState.disabled) {
      // no props by default
      this.executeCommand()
    }
  }

  executeCommand (params) {
    this.send('executeCommand', this.props.commandName, this.props.commandState, params)
  }

  _getTooltipText () {
    const label = this._getLabel()
    // TODO: instead of letting this tool lookup keyboard shortcutm it should
    const keyboardShortcut = this.props.keyboardShortcut
    if (keyboardShortcut) {
      return [label, ' (', keyboardShortcut, ')'].join('')
    } else {
      return label
    }
  }

  _getName () {
    return this.props.commandName
  }

  _getLabel () {
    return this.context.labelProvider.getLabel(this._getName())
  }

  _getIconName () {
    return this._getName()
  }

  // Used by Configurator to detect that only Tool classes are registered
  get _isTool () {
    return true
  }
}
