import { Command } from 'substance'

export default class SwitchViewCommand extends Command {
  getCommandState (params, context) {
    let state = context.appState
    if (!state) {
      return Command.DISABLED
    }
    let viewName = state.viewName
    let active = (viewName === this.config.viewName)
    return {
      disabled: false,
      active
    }
  }

  execute (params, context) {
    // Note: switch from using app state to simple action
    // because we do not yet have a good way to 'inherit' app state
    // i.e. the correct app state would be that of ArticlePanel, but
    // here we have ManuscriptEditor or MetadataEditor
    if (context.editor) {
      context.editor.send('updateViewName', this.config.viewName)
    }
  }
}
