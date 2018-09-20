import { Command } from 'substance'

export default class SaveCommand extends Command {
  getCommandState (params, context) {
    let archive = context.archive
    if (!archive || !archive.hasPendingChanges()) {
      return {
        disabled: true
      }
    } else {
      return {
        disabled: false
      }
    }
  }

  execute (params, context) {
    context.editor.send('save')
  }
}
