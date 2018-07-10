import { Command } from 'substance'

export default class SwitchViewCommand extends Command {
  getCommandState () {
    let commandState = {
      disabled: false
    }
    return commandState
  }

  execute () {
    console.info('TODO: switch view to ', this.config.view)
  }
}
