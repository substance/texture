import { Command } from 'substance'

const ENABLED = Object.freeze({ disabled: false })

export default class FindAndReplaceCommand extends Command {
  getCommandState (params, context) {
    switch (this.config.action) {
      case 'open-find':
      case 'open-replace': {
        return ENABLED
      }
      // TODO: do we need this anymore. ATM we do not have a global command
      // enabled, e.g. for a global keyboardshortcut drive way of navigating
      // search results. ATM this works only if the FindAndReplaceDialog has focus
      // case 'find-next':
      // case 'find-previous': {
      //   let fnrState = context.appState.findAndReplace
      //   if (fnrState && fnrState.count > 0) {
      //     return ENABLED
      //   } else {
      //     return Command.DISABLED
      //   }
      // }
    }
  }

  execute (params, context) {
    let fnr = context.findAndReplaceManager
    switch (this.config.action) {
      case 'open-find': {
        fnr.openDialog()
        break
      }
      case 'open-replace': {
        fnr.openDialog('replace')
        break
      }
      // TODO: see above
      // case 'find-next': {
      //   fnr.next()
      //   break
      // }
      // case 'find-previous': {
      //   fnr.previous()
      //   break
      // }
    }
  }
}
