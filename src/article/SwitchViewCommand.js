import { Command } from 'substance'

export default class SwitchViewCommand extends Command {
  getCommandState (params, context) {
    let state = context.appState
    if (!state) {
      return Command.DISABLED
    }
    let view = state.view
    let active = (view === this.config.view)
    return {
      disabled: false,
      active
    }
  }

  execute (params, context) {
    let state = context.appState
    if (state) {
      state.view = this.config.view
      state.propagate()
    }
  }
}
