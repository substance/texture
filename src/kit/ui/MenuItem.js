import { Component } from 'substance'

/**
  @param {boolean} props.label whether to render a label
  @param {string} props.commandName the associated command
  @param {object} props.commandState the current state of the associated command
  @param {string} props.keyboardShortcut the associated keyboard shortcut
*/
export default class MenuItem extends Component {
  render ($$) {
    let commandState = this.props.commandState
    let el = $$('button')
      .addClass('sc-menu-item')
      .append(
        this._renderIcon($$),
        this._renderLabel($$),
        this._renderKeyboardShortcut($$)
      )
      .on('click', this._onClick)

    if (this.props.label) {
      el.append(this.renderLabel($$))
    }
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
    return $$('div').addClass('se-icon').append(
      this.context.iconProvider.renderIcon($$, this.props.commandName)
    )
  }

  _renderKeyboardShortcut ($$) {
    return $$('div').addClass('se-keyboard-shortcut').append(
      this.props.keyboardShortcut || ''
    )
  }

  executeCommand (params) {
    if (!this.props.commandState.disabled) {
      this.send('executeCommand', this.props.commandName, this.props.commandState, params)
    }
  }

  _getLabel () {
    let labelProvider = this.context.labelProvider
    return labelProvider.getLabel(this.props.commandName, this.props.commandState)
  }

  _onClick (e) {
    e.preventDefault()
    e.stopPropagation()
    this.executeCommand()
  }
}
