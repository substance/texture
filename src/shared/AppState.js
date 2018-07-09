import { uuid, isFunction } from 'substance'

const UUID = uuid()

export default class AppState {
  constructor () {
    this.values = new Map()

    this._dirty = {}
    this._updates = {}
    this._observers = new Map()

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

  addObserver (names, handler, observer, opts) {
    if (!isFunction(observer[handler])) {
      throw new Error('Provided handler is invalid.')
    }
    const key = this._getKey(observer, names)
    this._observers.set(key, {
      observer,
      handler,
      names,
      opts
    })
  }

  removeObserver (observer) {
    const key = this._getKey(observer)
    delete this._observers.delete(key)
  }

  _getKey (observer) {
    let key = observer[UUID]
    if (!key) {
      key = uuid()
      observer[UUID] = this
    }
    return key
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
