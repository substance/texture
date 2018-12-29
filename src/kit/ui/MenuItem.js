import AbstractCommandTool from './AbstractCommandTool'

export default class MenuItem extends AbstractCommandTool {
  render ($$) {
    const { style, item, commandState } = this.props
    let el = $$('button')
      .addClass('sc-menu-item')
      .addClass('sm-' + item.name)

    switch (style) {
      case 'minimal': {
        el.append(this._renderIcon($$))
        break
      }
      case 'descriptive': {
        el.append(
          this._renderLabel($$),
          this._renderKeyboardShortcut($$)
        )
        break
      }
      default: {
        el.append(
          this._renderIcon($$),
          this._renderLabel($$),
          this._renderKeyboardShortcut($$)
        )
      }
    }
    el.on('click', this._onClick)

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
}
