import { Command } from 'substance'

export default class InsertRowCommand extends Command {
  getCommandState() {
    return true
  }
}
