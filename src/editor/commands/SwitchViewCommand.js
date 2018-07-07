import { Command } from 'substance'

export default class SwitchViewCommand extends Command {
  getCommandState (params, context) {
    let commandState = {
      disabled: false
    }
    return commandState
  }

  execute (params, context) {
    console.log('TODO: switch view to ', this.config.view)
  }
}
