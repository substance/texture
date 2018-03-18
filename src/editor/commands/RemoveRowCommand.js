import { Command } from 'substance'

export default class RemoveRowCommand extends Command {
  getCommandState() {
    return true
  }
}
