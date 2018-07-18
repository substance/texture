import { Command } from 'substance'

export default class AddEntityCommand extends Command {
  getCommandState () {
    return { disabled: false }
  }
  execute () {
    console.info('MEH')
  }
}