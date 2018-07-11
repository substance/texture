import { Selection } from 'substance'
import AppState from './AppState'
import SelectionStateReducer from './SelectionStateReducer'

const ANY = '@any'

export default class EditorState extends AppState {
  _initialize (doc) {
    this._set('document', doc)
    this._set('selection', Selection.nullSelection)
    this._set('commandStates', [])

    let selectionStateReducer = new SelectionStateReducer(this)
    selectionStateReducer.update()
  }

  _createSlot (id, stage, deps) {
    this._schedule = null
    if (deps.indexOf('document') !== -1) {
      return new DocumentSlot(this, id, stage, deps)
    } else {
      return new Slot(this, id, stage, deps)
    }
  }
}

class Slot {
  constructor (editorState, id, stage, deps) {
    this._id = editorState._id
    this.id = id
    this.editorState = editorState
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
    return observer[this._id].get(this.id)
  }

  _deleteEntry (observer) {
    delete observer[this._id].get(this.id)
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
    const entry = observer[this._id].get(this.id)
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
