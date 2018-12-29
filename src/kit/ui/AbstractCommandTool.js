import { Component } from 'substance'

/**
 *
 * @param {string} props.style menu style, one of 'minimal', 'descriptive', 'full'
 * @param {string} props.theme
 * @param {object} props.item
 * @param {object} props.commandState
 */
export default class AbstractCommandTool extends Component {
  render ($$) {
    throw new Error('This method is abstract.')
  }

  executeCommand (params) {
    const { item, commandState } = this.props
    // TODO: rethink this. Should we inhibit command execution here
    // or rely on the command not to execute when disabled?
    if (!commandState.disabled) {
      this.send('executeCommand', item.name, commandState, params)
    }
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

  _onClick (e) {
    e.preventDefault()
    e.stopPropagation()
    this.executeCommand()
  }
}
