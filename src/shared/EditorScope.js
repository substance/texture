import { ArrayTree, forEach } from 'substance'

// EXPERIMENTAL: this will replace 'editorSession' and will be connected to and driven by the Flow
export default class EditorScope {
  constructor (flow, parentScope, props, context) {
    this.id = props.id
    this.parentScope = parentScope

    this._editorSession = props.editorSession
    if (this._editorSession) {
      throw new Error('"editorSession" is required')
    }
    this._surfaceManager = props.editorSession.surfaceManager
    this._context = context
  }

  getSurfaceManager () {
    return this._surfaceManager
  }

  getDocument () {
    return this._editorSession.getDocument()
  }

  transaction (...args) {
    return this._editorSession.transaction(...args)
  }

  registerObserver (resources, observer, options) {
    /*
      Note: this API can be a bit more complex, as it is used internally only.

      TODO: need to understand how the bridge between ManagedComponents and the Flow
      should look-like
      The Flow does not have a notion of hierarchical observers for documents for instance.
      So we need an extra layer that dispatches updates received from the Flow to the ManagedComponents considering
      resource specific filters

      Typical cases:
      - Most often we have NodeComponents: they would be registered for ['document'], with filter by id
      - Some are listening to 'commandStates' which is not combined
      - TODO: need to find cases which listening to multiple resources

      Next steps:
      - create a Prototype that just deals with the cases as we unlock them
      - collect examples
    */

    /* Examples:
      - NodeComponent: 'document' filtered by 'node.id', stage: 'render'
        -> let NodeComponent use the low-level API, instead of using managed props
      - TextPropertyComponent/TextPropertyEditor:
        register a managed version registers with this scope
    */
    resources.sort()
    let id = resources.toString()
    if (options.stage) id = [id, '@', options.stage].join('')
    if (!this.slots.has(id)) {
      let slot = this._initializeSlot(id, resources)
      this.slots.set(slot)
      let qualifiedResource = resources.map(name => {
        return [this.id, name].join('.')
      })
      this.flow.registerObserver(qualifiedResource, slot, options.stage)
    }
    let slot = this.slots.get(id)
    slot.addObserver(observer, options)
    // HACK: leave the slot id on the observer so that we can deregister it more easily
    observer._slotId = id
  }

  removeObserver (observer) {
    let slotId = observer._slotId
    let slot = this.slots.get(slotId)
    if (slot) {
      slot.removeObserver(observer)
    }
  }

  _initializeSlot (id, resources) {
    let slot
    // TODO: this should come from a configuration
    // ATM, I see only two types, regular values, and Documents
    let _slots = resources.map(name => {
      if (name === 'document') {
        return new DocumentSlot(id)
      } else {
        return new AppStateSlot(id, name)
      }
    })
    if (_slots.length > 1) {
      slot = new CombinedSlot(_slots)
    } else {
      slot = _slots[0]
    }
    return slot
  }
}

class AppStateSlot {
  constructor (id, name) {
    this.id = id
    this.name = name
    this.observers = new Set()
  }

  addObserver (observer) {
    this.observers.add(observer)
  }

  removeObserver (observer) {
    this.observers.delete(observer)
  }

  getObservers (update) {
    if (update[this.id]) {
      return this.observers
    }
  }
}

class DocumentSlot {
  constructor (id) {
    this.index = new ArrayTree()
    this.observer2path = new Map()
  }

  addObserver (observer, opts) {
    let path = opts.path
    this.index.add(path, observer)
    this.observer2path.set(observer, path)
  }

  removeObserver (observer) {
    let path = this.observer2path.get(observer)
    this.index.remove(path, observer)
  }

  getObservers (update) {
    if (update.document) {
      let change = update.document
      let observers = []
      forEach(change.updated, (path) => {
        observers = observers.concat(this.index.get(path))
      })
      return new Set(observers)
    }
  }
}

class CombinedSlot {
  constructor (slots) {
    this.slots = slots
  }

  addObserver (observer, params) {
    this.slots.forEach(slot => slot.addObserver(observer, params))
  }

  removeObserver (observer) {
    this.slots.forEach(slot => slot.removeObserver(observer))
  }

  getObservers (update) {
    let result
    this.slots.forEach(slot => {
      let observers = slot.getObservers(update)
      if (observers) {
        if (!result) result = new Set()
        observers.forEach(observer => result.add(observer))
      }
    })
    return result
  }
}
