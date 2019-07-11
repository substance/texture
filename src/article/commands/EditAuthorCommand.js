import { Person } from '../nodes'
import EditEntityCommand from './EditEntityCommand'

export default class EditAuthorCommand extends EditEntityCommand {
  _getType () {
    return Person.type
  }
  getCommandState (params, context) {
    let commandState = super.getCommandState(params, context)
    if (!commandState.disabled) {
      let node = commandState.node
      let xpath = node.getXpath().toArray()
      if (!xpath.find(x => x.property === 'authors')) {
        return { disabled: true }
      }
    }
    return commandState
  }
}
