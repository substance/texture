import { uuid, isNil, isFunction } from 'substance'
import AbstractAppState from './AbstractAppState'

const ANY = '@any'
const STAGES = ['update', 'pre-render', 'render', 'post-render', 'position', 'finalize']
const DEFAULT_STAGE = 'update'
const STAGE_IDX = STAGES.reduce((m, s, idx) => {
  m[s] = idx
  return m
}, {})

export default class AppState extends AbstractAppState {
  constructor (...args) {
    super()

    this._id = uuid()
    this._slots = new Map()
    this._schedule = null

    this._initialize(...args)
  }

  _initialize (initialState) {
    let names = Object.keys(initialState)
    names.forEach(name => {
      let val = initialState[name]
      this._set(name, val)
    })
  }

  addObserver (deps, handler, observer, options = {}) {
    if (isNil(handler)) throw new Error('Provided handler function is nil')
    if (!isFunction(handler)) throw new Error('Provided handler is not a function')
    handler = handler.bind(observer)

    if (!options.stage) options.stage = DEFAULT_STAGE
    const stage = options.stage
    const slotId = this._getSlotId(stage, deps.slice())
    let slot = this._slots.get(slotId)
    if (!slot) {
      slot = this._createSlot(slotId, stage, deps)
      this._slots.set(slotId, slot)
    }
    if (!observer[this._id]) observer[this._id] = new Map()
    slot.addObserver(observer, {
      stage,
      deps,
      handler,
      options
    })
  }

  removeObserver (observer) {
    let entries = observer[this._id] || []
    entries.forEach(e => {
      e.slot.removeObserver(observer)
    })
    delete observer[this._id]
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

  propagate (...args) {
    return this.propagateUpdates(...args)
  }

  _getSlotId (stage, deps) {
    deps.sort()
    return `@${stage}:${deps.join(',')}`
  }

  _createSlot (id, stage, deps) {
    this._schedule = null
    return new Slot(this, id, stage, deps)
  }

  // order slots by stage
  _getSchedule () {
    let schedule = this._schedule
    if (!schedule) {
      schedule = []
      this._slots.forEach(s => schedule.push(s))
      schedule.sort((a, b) => STAGE_IDX[a.stage] - STAGE_IDX[b.stage])
      this._schedule = schedule
    }
    return schedule
  }

  _reset () {
    super._reset()
    this._setDirty(ANY)
  }
}

class Slot {
  constructor (appState, id, stage, deps) {
    this._id = appState._id
    this.id = id
    this.appState = appState
    this.stage = stage
    this.deps = deps

    this.observers = new Set()
  }

  addObserver (observer, spec) {
    observer[this._id].set(this.id, {
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
    return observer[this._id].get(this.id)
  }

  _deleteEntry (observer) {
    delete observer[this._id].get(this.id)
  }

  _notifyObserver (entry) {
    entry.spec.handler()
  }
}
