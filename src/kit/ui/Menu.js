import { Component } from 'substance'
import MenuItem from './MenuItem'

/*
  @param {array} props.items
  @param {object} props.commandStates
*/
export default class Menu extends Component {
  render ($$) {
    const items = this.props.items
    const commandStates = this.props.commandStates

    let el = $$('div').addClass('sc-menu')
    items.forEach(itemSpec => {
      const commandName = itemSpec.commandName
      if (commandName) {
        const commandState = commandStates[commandName]
        el.append(
          $$(MenuItem, {
            commandName,
            commandState
          })
        )
      } else if (itemSpec.type === 'separator') {
        el.append(
          $$('div').addClass('separator')
        )
      } else {
        throw new Error('Invalid menu item specification: ' + JSON.stringify(itemSpec))
      }
    })
    return el
  }
}
