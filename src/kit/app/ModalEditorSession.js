import StageSession from './StageSession'
import SurfaceManager from './SurfaceManager'
import MarkersManager from './MarkersManager'
import KeyboardManager from './KeyboardManager'
import CommandManager from './CommandManager'

export default class ModalEditorSession extends StageSession {
  constructor (id, parentEditorSession, config, editor, initialEditorState) {
    super(id, parentEditorSession, initialEditorState)

    const editorState = this.editorState
    this._config = config
    this._editor = editor
    this._contextProvider = editor

    let surfaceManager = new SurfaceManager(editorState)
    let markersManager = new MarkersManager(editorState)
    let keyboardManager = new KeyboardManager(config.getKeyboardShortcuts(), (commandName, params) => {
      return this.executeCommand(commandName, params)
    }, this._contextProvider)
    let commandManager = new CommandManager(editorState,
      // update commands when document or selection have changed
      // TODO: is this really sufficient?
      ['document', 'selection'],
      config.getCommands({ inherit: true }),
      this._contextProvider
    )
    this.surfaceManager = surfaceManager
    this.markersManager = markersManager
    this.keyboardManager = keyboardManager
    this.commandManager = commandManager

    this.commandManager.initialize()
  }

  dispose () {
    super.dispose()
    this.commandManager.dispose()
    this.markersManager.dispose()
    this.surfaceManager.dispose()
  }

  _createEditorState (document, initialState = {}) {
    return Object.assign({
      focusedSurface: null,
      commandStates: {}
    }, super._createEditorState(document, initialState))
  }

  executeCommand (commandName, params) {
    return this.commandManager.executeCommand(commandName, params)
  }

  getCommandStates () {
    return this.editorState.commandStates
  }

  getConfigurator () {
    return this._config
  }

  getContext () {
    return this.contextProvider.context
  }

  getFocusedSurface () {
    return this.editorState.focusedSurface
  }

  getSurface (surfaceId) {
    return this.surfaceManager.getSurface(surfaceId)
  }
}
