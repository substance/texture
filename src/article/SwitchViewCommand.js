import { Command } from 'substance'

export default class SwitchViewCommand extends Command {
  getCommandState (params, context) {
    let state = context.state
    let view = state.get('view')
    let active = (view === this.config.view)
    let commandState = {
      disabled: false,
      active
    }
    return commandState
  }

  execute (params, context) {
    let state = context.state
    state.set('view', this.config.view)
    state.propagate()
  }
}
