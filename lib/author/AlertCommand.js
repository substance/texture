
import { Command } from 'substance'

export default class AlertCommand extends Command {
  getCommandState() {
    return {
      message: 'Hello world',
      disabled: false
    }
  }


  execute(params) {
    alert(params.commandState.message)
  }
}
