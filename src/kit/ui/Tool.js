import { Component } from 'substance'
import Button from './Button'

/**
 *
 * @param {string} props.style menu style, one of 'minimal', 'descriptive', 'full'
 * @param {string} props.theme
 * @param {object} props.item
 * @param {object} props.commandState
 */
export default class Tool extends Component {
  render ($$) {
    const { style, theme, commandState } = this.props
    let el
    switch (style) {
      case 'minimal': {
        el = $$(Button, {
          style,
          theme,
          icon: this._getIconName(),
          tooltip: this._getTooltipText()
        })
        break
      }
      case 'descriptive': {
        // TODO: try to use Button instead
        el = $$('button')
        el.append(
          this._renderLabel($$),
          this._renderKeyboardShortcut($$)
        )
        break
      }
      default: {
        // TODO: try to use Button instead
        el = $$('button')
        el.append(
          this._renderIcon($$),
          this._renderLabel($$),
          this._renderKeyboardShortcut($$)
        )
      }
    }
    el.addClass(this.getClassNames())
    el.on('click', this._onClick)
      // ATTENTION: we need to preventDefault on mousedown, otherwise
      // native DOM selection disappears
      .on('mousedown', this._onMousedown)

    if (commandState.active) {
      el.addClass('sm-active')
    }
    if (commandState.disabled) {
      // make button inaccessible
      el.attr('tabindex', -1)
        .attr('disabled', true)
    } else {
      // make button accessible for tab-navigation
      el.attr('tabindex', 1)
    }

    return el
  }

  executeCommand (params) {
    const { item, commandState } = this.props
    // TODO: rethink this. Should we inhibit command execution here
    // or rely on the command not to execute when disabled?
    if (!commandState.disabled) {
      this.send('executeCommand', item.name, params)
    }
  }

  click () {
    return this.el.click()
  }

  _getLabel () {
    const { item, commandState } = this.props
    const labelName = item.label || item.name
    const labelProvider = this.context.labelProvider
    return labelProvider.getLabel(labelName, commandState)
  }

  _getIconName () {
    const item = this.props.item
    const iconName = item.icon || item.name
    return iconName
  }

  _getKeyboardShortcut () {
    const name = this.props.item.name
    const config = this.context.config
    return config.getKeyboardShortcutsByCommandName(name)
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

  _renderLabel ($$) {
    return $$('div').addClass('se-label').append(
      this._getLabel()
    )
  }

  _renderIcon ($$) {
    const iconName = this._getIconName()
    return $$('div').addClass('se-icon').append(
      this.context.iconProvider.renderIcon($$, iconName)
    )
  }

  _renderKeyboardShortcut ($$) {
    const keyboardShortcut = this._getKeyboardShortcut()
    return $$('div').addClass('se-keyboard-shortcut').append(
      keyboardShortcut || ''
    )
  }

  _onClick (e) {
    e.preventDefault()
    e.stopPropagation()
    this.executeCommand()
  }

  _onMousedown (e) {
    e.preventDefault()
  }

  // this is used by TextureConfigurator
  get _isTool () {
    return true
  }
}
