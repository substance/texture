import {
  EventEmitter, ChangeHistory, Transaction, operationHelpers, Selection, DocumentChange
} from 'substance'

export default class DocumentSession extends EventEmitter {
  constructor (doc) {
    super()

    this._document = doc
    this._selection = Selection.null
    this._history = new ChangeHistory()
    this._transaction = new Transaction(doc)
  }

  getDocument () {
    return this._document
  }

  canUndo () {
    return this._history.canUndo()
  }

  canRedo () {
    return this._history.canRedo()
  }

  createSelection (...args) {
    return this._document.createSelection(...args)
  }

  /**
    Start a transaction to manipulate the document

    @param {function} transformation a function(tx) that performs actions on the transaction document tx

    @example

    ```js
    doc.transaction(function(tx, args) {
      tx.update(...)
      ...
      tx.setSelection(newSelection)
    })
    ```
  */
  transaction (transformation, info) {
    let change = this._recordChange(transformation, info)
    if (change) {
      this._commit(change, info)
    }
    return change
  }

  undo () {
    return this._undoRedo('undo')
  }

  redo () {
    return this._undoRedo('redo')
  }

  /*
    There are cases when we want to explicitly reset the change history of
    an editor session
  */
  resetHistory () {
    this._history.reset()
  }

  // EXPERIMENTAL: for certain cases it is useful to store volatile information on nodes
  // Then the data does not need to be disposed when a node is deleted.
  updateNodeStates (tuples, silent) {
    // using a pseudo change to get into the existing updating mechanism
    const doc = this._document
    let change = new DocumentChange([], {}, {})
    let info = { action: 'node-state-update' }
    change._extractInformation()
    change.info = info
    for (let [id, state] of tuples) {
      let node = doc.get(id)
      if (!node) continue
      if (!node.state) node.state = {}
      Object.assign(node.state, state)
      change.updated[id] = true
    }
    if (!silent) {
      doc._notifyChangeListeners(change, info)
      this.emit('change', change, info)
    }
  }

  _recordChange (transformation, info) {
    const t = this._transaction
    info = info || {}
    t._sync()
    return t._recordChange(transformation, info)
  }

  _undoRedo (which) {
    const doc = this.getDocument()
    var from, to
    if (which === 'redo') {
      from = this._history.undoneChanges
      to = this._history.doneChanges
    } else {
      from = this._history.doneChanges
      to = this._history.undoneChanges
    }
    var change = from.pop()
    if (change) {
      this._applyChange(change, {})
      this._transaction.__applyChange__(change)
      // move change to the opposite change list (undo <-> redo)
      to.push(doc.invert(change))
    }
    return change
  }

  _transformLocalChangeHistory (externalChange) {
    // Transform the change history
    // Note: using a clone as the transform is done inplace
    // which is ok for the changes in the undo history, but not
    // for the external change
    var clone = {
      ops: externalChange.ops.map(function (op) { return op.clone() })
    }
    operationHelpers.transformDocumentChange(clone, this._history.doneChanges)
    operationHelpers.transformDocumentChange(clone, this._history.undoneChanges)
  }

  _commit (change, info) {
    this._commitChange(change, info)
  }

  _commitChange (change, info = {}) {
    change.timestamp = Date.now()
    this._applyChange(change, info)
    if (info['history'] !== false && !info['hidden']) {
      let inverted = this.getDocument().invert(change)
      this._history.push(inverted)
    }
  }

  _applyChange (change, info) {
    if (!change) {
      console.error('FIXME: change is null.')
      return
    }
    const doc = this.getDocument()
    doc._apply(change)
    doc._notifyChangeListeners(change, info)
    this.emit('change', change, info)
  }

  _applyRemoteChange (change) {
    // console.log('EditorSession: applying remote change');
    if (change.ops.length > 0) {
      this._applyChange(change, { remote: true })
      // update the 'stage' and the undo-history too
      this._transaction.__applyChange__(change)
    }
  }
}
