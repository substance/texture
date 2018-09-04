import { Command } from 'substance'

export default class FindAndReplaceCommand extends Command {
  getCommandState (params, context) {
    return { disabled: false }
  }

  execute (params, context) {
    let fnr = context.findAndReplaceManager
    switch (this.config.action) {
      case 'open-find': {
        fnr.showDialog()
        break
      }
      case 'open-replace': {
        fnr.showDialog('replace')
        break
      }
    }
  }
}