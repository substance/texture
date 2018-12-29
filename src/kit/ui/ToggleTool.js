import AbstractCommandTool from './AbstractCommandTool'
import Tooltip from './Tooltip'

/**
 * @param {string} props.style
 * @param {string} props.theme
 * @param {object} props.item
 * @param {object} props.commandState
 */
export default class ToggleTool extends AbstractCommandTool {
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
    }).on('click', this._onClick)
    return btn
  }

  getClassNames () {
    return `sm-${this.props.item.name}`
  }

  _getTooltipText () {
    const label = this._getLabel()
    const keyboardShortcut = this._getKeyboardShortcut()
    if (keyboardShortcut) {
      return [label, ' (', keyboardShortcut, ')'].join('')
    } else {
      return label
    }
  }

  // Used by Configurator to detect that only Tool classes are registered
  get _isTool () {
    return true
  }
}
