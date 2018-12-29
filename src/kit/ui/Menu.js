import { Component } from 'substance'

const DISABLED = { disabled: true }

/**
 * @param {array} props.items
 * @param {object} props.commandStates
 */
export default class Menu extends Component {
  render ($$) {
    const { style, theme, items, commandStates } = this.props
    let el = $$('div').addClass('sc-menu')
    // TODO: try to consolidate. This is very similar to ToolGroup
    for (let item of items) {
      if (item.type === 'command') {
        const commandState = commandStates[item.name] || DISABLED
        const ItemComponent = item.component ? this.getComponent(item.component) : this.getComponent('menu-item')
        el.append(
          $$(ItemComponent, {
            style,
            theme,
            item,
            commandState
          })
        )
      } else if (item.type === 'separator') {
        el.append(
          $$('div').addClass('separator')
        )
      } else {
        console.error('FIXME: Unsupported menu item type.', JSON.stringify(item))
      }
    }
    return el
  }
}
