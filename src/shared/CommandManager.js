import { HandlerParams } from 'substance'

export default class CommandManager {
  constructor (appState, deps, commands, contextProvider) {
    this.appState = appState
    this.commands = commands
    this.contextProvider = contextProvider

    appState.addObserver(deps, this.reduce, this, { stage: 'update' })
  }

  dispose () {
    this.appState.off(this)
  }

  // HACK: don't know yet how to use AppState API here
  reduce () {
    const commands = this.commands
    const appState = this.appState
    const context = this.contextProvider.context
    const params = new HandlerParams(context)
    const commandStates = {}
    commands.forEach(command => {
      commandStates[command.name] = command.getCommandState(params, context)
    })
    appState.set('commandStates', commandStates)
  }

  executeCommand (commandName) {
    const appState = this.appState
    const cmdState = appState.commandStates[commandName]
    if (!cmdState || cmdState.disabled) {
      return false
    } else {
      const cmd = this.commands.get(commandName)
      const context = this.contextProvider.context
      const params = new HandlerParams(context)
      params.commandState = cmdState
      cmd.execute(params, context)
    }
  }
}
