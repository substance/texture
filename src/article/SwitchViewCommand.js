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
    let state = context.appState
    if (state) {
      state.viewName = this.config.viewName
      state.propagate()
    }
  }
}
