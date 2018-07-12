import { uuid, Selection, isNil, isFunction } from 'substance'
import AbstractAppState from './AbstractAppState'
import SelectionStateReducer from './SelectionStateReducer'

const UUID = uuid()
const ANY = '@any'
const STAGES = ['update', 'pre-render', 'render', 'post-render', 'position', 'finalize']
const DEFAULT_STAGE = 'update'
const STAGE_IDX = STAGES.reduce((m, s, idx) => {
  m[s] = idx
  return m
}, {})

export default class EditorState extends AbstractAppState {
  constructor (doc) {
    super()

    this._slots = new Map()
    this._schedule = null

    this._initialize(doc)
  }

  _initialize (doc) {
    this._set('document', doc)
    this._set('selection', Selection.nullSelection)
    this._set('commandStates', [])

    let selectionStateReducer = new SelectionStateReducer(this)
    selectionStateReducer.update()
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
    if (!observer[UUID]) observer[UUID] = new Map()
    slot.addObserver(observer, {
      stage,
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

  _getSlotId (stage, deps) {
    deps.sort()
    return `@${stage}:${deps.join(',')}`
  }

  _createSlot (id, stage, deps) {
    this._schedule = null
    if (deps.indexOf('document') !== -1) {
      return new DocumentSlot(this, id, stage, deps)
    } else {
      return new Slot(this, id, stage, deps)
    }
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
  constructor (editorState, id, stage, deps) {
    this.id = id
    this.editorState = editorState
    this.stage = stage
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
    const state = this.editorState
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

  _getDocumentChange () {
    let { change, info } = this._updates['document']
    change.info = info
    return change
  }

  _notifyObserver (entry) {
    const state = this.editorState
    let spec = entry.spec
    // TODO: we want to drop this auto-arguments completely
    // after having switched to a pure AppState based implementation
    // i.e. without using observers via EditorSession
    if (spec.deps.length === 1) {
      let name = spec.deps[0]
      switch (name) {
        case 'document': {
          let update = state.getUpdate('document') || {}
          spec.handler(update.change, update.info)
          break
        }
        default:
          spec.handler(state.get(name))
      }
    } else {
      spec.handler()
    }
  }
}

class DocumentSlot extends Slot {
  constructor (editorState, id, stage, deps) {
    super(editorState, id, stage, deps)

    this.byPath = {'@any': new Set()}
  }

  addObserver (observer, spec) {
    super.addObserver(observer, spec)

    const index = this.byPath
    let docSpec = spec.options.document
    if (docSpec && docSpec.path) {
      let key = docSpec.path
      let records = index[key]
      if (!records) {
        records = index[key] = new Set()
      }
      records.add(observer)
    } else {
      index[ANY].add(observer)
    }
  }

  removeObserver (observer) {
    const entry = observer[UUID].get(this.id)
    const index = this.byPath

    super.removeObserver(observer)

    let docSpec = entry.spec.options.document
    if (docSpec && docSpec.path) {
      let key = docSpec.path
      let records = index[key]
      records.delete(observer)
    } else {
      index[ANY].delete(observer)
    }
  }

  _getObservers () {
    const state = this.editorState
    if (!state.isDirty('document')) return this.observers

    // notify all observers that are affected by the change
    const index = this.byPath
    let { change } = state.getUpdate('document')

    if (!change) {
      console.error('FIXME: expected to find a document change as update for document')
      return index[ANY]
    }

    let updated = Object.keys(change.updated)
    let sets = []
    // observers without a path spec are registered with path=undefined
    sets.push(index[ANY])
    updated.forEach(path => {
      let key = String(path)
      let set = index[key]
      if (set) sets.push(set)
    })
    let observers = new Set()
    sets.forEach(s => {
      s.forEach(o => observers.add(o))
    })
    return observers
  }
}
