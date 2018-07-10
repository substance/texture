import mapify from './mapify'

const DISABLED = Object.freeze({ disabled: true })

/*
  WIP: trying to evolve a next generation implementation
  Also experimenting with AppState API here.
*/
export default class CommandManager {
  constructor (commands, appState) {
    this.appState = appState
    this.commands = mapify(commands, 'name')

    this._initialize()
  }

  getCommand (commandName) {
    let cmd = this.commands.get(commandName)
    if (!cmd) {
      console.warn('command', commandName, 'not registered')
      return
    }
    return cmd
  }

  executeCommand (commandName, params, context) {
    const cmd = this.getCommand(commandName)
    if (!cmd) return
    const commandStates = this.appState.get('commandStates') || new Map()
    const commandState = commandStates.get(commandName) || DISABLED
    params = this._getCommandParams(params, commandState)
    let info = cmd.execute(params, context)
    return info
  }

  _getCommandParams (params, commandState) {
    params = Object.assign({}, params)
    if (commandState) params.commandState = commandState
    return params
  }

  _updateCommandStates (params, context) {
    let commandStates = new Map()
    for (let [name, cmd] of this.commands) {
      let commandState = cmd.getCommandState(this._getCommandParams(params), context)
      commandStates.set(name, commandState)
    }
    this.appState.set('commandStates', commandStates)
  }

  _initialize () {
    this._resetCommandStates()
  }

  _resetCommandStates () {
    let commandStates = new Map()
    for (let name of this.commands.keys()) {
      commandStates.set(name, DISABLED)
    }
    this.appState.set('commandStates', commandStates)
  }
}
