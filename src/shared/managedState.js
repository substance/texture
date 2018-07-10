import AppState from './AppState'

export default function managedState (component, initialState) {
  let appState = new AppState()
  let names = Object.keys(initialState)
  let properties = {}
  names.forEach(name => {
    let val = initialState[name]
    appState._set(name, val)
    properties[name] = {
      get () { return appState.get(name) },
      set (val) { return appState.set(name, val) }
    }
  })
  appState.addObserver('@any', () => {
    component.rerender()
  }, component)
  let state = Object.create({
    observe (...args) { return appState.observe(...args) },
    addObserver (...args) { return appState.addObserver(...args) },
    off (...args) { return appState.off(...args) },
    get (...args) { return appState.get(...args) },
    set (...args) { return appState.set(...args) },
    propagate (...args) { return appState.propagate(...args) }
  }, properties)
  return state
}
