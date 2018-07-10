import { uuid, isNil, isFunction } from 'substance'
import AbstractAppState from './AbstractAppState'

const UUID = uuid()

// TODO: this is very redundant with EditorState
// Try to refactor so that the implementation can be shared
export default class AppState extends AbstractAppState {
  constructor () {
    super()

    this._slots = new Map()
    this._schedule = null
    this._isFlowing = false
  }

  static create (initialState) {
    let appState = new AppState()
    let state = {
      observe (...args) { appState.addObserver(...args) },
      off (observer) { appState.removeObserver(observer) },
      propagate () { appState.propagateUpdates() }
    }
    let names = Object.keys(initialState)
    names.forEach(name => {
      let val = initialState[name]
      appState._set(name, val)
      Object.defineProperty(state, name, {
        get () { return appState.get(name) },
        set (val) { return appState.set(name, val) }
      })
    })
    return state
  }

  addObserver (deps, handler, observer, options = {}) {
    if (isNil(handler)) throw new Error('Provided handler function is nil')
    if (!isFunction(handler)) throw new Error('Provided handler is not a function')
    handler = handler.bind(observer)

    const slotId = this._getSlotId(deps.slice())
    let slot = this._slots.get(slotId)
    if (!slot) {
      slot = this._createSlot(slotId, deps)
      this._slots.set(slotId, slot)
    }
    if (!observer[UUID]) observer[UUID] = new Map()
    slot.addObserver(observer, {
      deps,
      handler,
      options
    })
  }

  removeObserver (observer) {
    let entries = observer[UUID] || []
    entries.forEach(e => {
      e.slot.removeObserver(observer)
    })
    delete observer[UUID]
  }

  propagateUpdates () {
    if (this._isFlowing) throw new Error('Already updating.')
    this._isFlowing = true
    try {
      const schedule = this._getSchedule()
      for (let slot of schedule) {
        if (slot.needsUpdate()) {
          slot.notifyObservers()
        }
      }
      this._reset()
    } finally {
      this._isFlowing = false
    }
  }

  _getSlotId (deps) {
    deps.sort()
    return `${deps.join(',')}`
  }

  _createSlot (id, deps) {
    this._schedule = null
    return new Slot(this, id, deps)
  }

  _getSchedule () {
    let schedule = this._schedule
    if (!schedule) {
      schedule = []
      this._slots.forEach(s => schedule.push(s))
      this._schedule = schedule
    }
    return schedule
  }
}

class Slot {
  constructor (appState, id, deps) {
    this.id = id
    this.appState = appState
    this.deps = deps

    this.observers = new Set()
  }

  addObserver (observer, spec) {
    observer[UUID].set(this.id, {
      slot: this,
      spec
    })
    this.observers.add(observer)
  }

  removeObserver (observer) {
    this._deleteEntry(observer)
    this.observers.delete(observer)
  }

  needsUpdate () {
    const state = this.appState
    for (let dep of this.deps) {
      if (state.isDirty(dep)) return true
    }
    return false
  }

  notifyObservers () {
    let observers = this._getObservers()
    for (let o of observers) {
      let entry = this._getEntryForObserver(o)
      // observer might have been disposed in the meantime
      if (!entry) continue
      this._notifyObserver(entry)
    }
  }

  _getObservers () {
    return this.observers
  }

  _getEntryForObserver (observer) {
    return observer[UUID].get(this.id)
  }

  _deleteEntry (observer) {
    delete observer[UUID].get(this.id)
  }

  _notifyObserver (entry) {
    let spec = entry.spec
    spec.handler()
  }
}
