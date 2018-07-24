import { TextPropertyEditor as SubstanceTextPropertyEditor } from 'substance'

// TODO: try to provide basic Surface and ContainerEditor implementations
// making it easier to use a different data binding mechanism
export default class TextPropertyEditor extends SubstanceTextPropertyEditor {
  // overriding event registration
  didMount () {
    let appState = this.context.appState
    appState.addObserver(['selection'], this._onSelectionChanged, this, {
      stage: 'render'
    })
    const surfaceManager = this.getSurfaceManager()
    if (surfaceManager) {
      surfaceManager.registerSurface(this)
    }
    const globalEventHandler = this.getGlobalEventHandler()
    if (globalEventHandler) {
      globalEventHandler.addEventListener('keydown', this._muteNativeHandlers, this)
    }
  }

  dispose () {
    this.context.appState.off(this)
    const surfaceManager = this.getSurfaceManager()
    if (surfaceManager) {
      surfaceManager.unregisterSurface(this)
    }
    const globalEventHandler = this.getGlobalEventHandler()
    if (globalEventHandler) {
      globalEventHandler.removeEventListener('keydown', this._muteNativeHandlers)
    }
  }
}
