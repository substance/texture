import { Command } from 'substance'

export default class AddEntityCommand extends Command {
  getCommandState () {
    return { disable: false }
  }
  execute () {
    console.log('MEH')
  }
}