export default class AbstractAppState {
  constructor () {
    this.values = new Map()

    this._dirty = {}
    this._updates = {}

    this._reset()
  }

  get (name) {
    return this.values.get(name)
  }

  set (name, newValue) {
    this._set(name, newValue)
    this._setDirty(name)
  }

  isDirty (name) {
    return this._dirty[name]
  }

  getUpdate (name) {
    return this._updates[name]
  }

  addObserver (deps, handler, observer, options = {}) {
    throw new Error('This method is abstract.')
  }

  removeObserver (observer) {
    throw new Error('This method is abstract.')
  }

  propagateUpdates () {
    throw new Error('This method is abstract.')
  }

  _set (name, newValue) {
    this.values.set(name, newValue)
  }

  _setDirty (name) {
    this._dirty[name] = true
  }

  _setUpdate (name, update) {
    this._updates[name] = update
    this._setDirty(name)
  }

  _reset () {
    this._dirty = {}
    this._updates = {}
  }
}
