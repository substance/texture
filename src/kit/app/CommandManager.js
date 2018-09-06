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

  reduce () {
    const appState = this.appState
    const commandStates = this._getCommandStates()
    appState.set('commandStates', commandStates)
  }

  _getCommandStates () {
    const context = this.contextProvider.context
    const params = new HandlerParams(context)
    return this.commands.reduce((m, command) => {
      m[command.getName()] = command.getCommandState(params, context)
      return m
    }, {})
  }

  executeCommand (commandName, params = {}) {
    const appState = this.appState
    const cmdState = appState.commandStates[commandName]
    if (!cmdState || cmdState.disabled) {
      return false
    } else {
      const cmd = this.commands.get(commandName)
      const context = this.contextProvider.context
      params = Object.assign(new HandlerParams(context), params)
      params.commandState = cmdState
      cmd.execute(params, context)
      return true
    }
  }
}
