import { getPos } from './nodeHelpers'

export default class AbstractCitationManager {
  constructor (documentSession, refType, targetTypes, labelGenerator) {
    this.documentSession = documentSession
    this.refType = refType
    this.targetTypes = new Set(targetTypes)
    this.labelGenerator = labelGenerator

    documentSession.on('change', this._onDocumentChange, this)
  }

  dispose () {
    this.documentSession.off(this)
  }

  hasCitables () {
    return this.getCitables().length > 0
  }

  getCitables () {
    return []
  }

  getSortedCitables () {
    return this.getCitables().sort((a, b) => {
      return getPos(a) - getPos(b)
    })
  }

  // TODO: how could this be generalized so that it is less dependent on the internal model?
  _onDocumentChange (change) {
    // HACK: do not react on node state updates
    if (change.info.action === 'node-state-update') return

    const ops = change.ops
    for (var i = 0; i < ops.length; i++) {
      let op = ops[i]
      if (op.isNOP()) continue
      // 1. xref has been added or removed
      // 2. citable has been add or removed
      if (this._detectAddRemoveXref(op) || this._detectAddRemoveCitable(op, change)) {
        return this._updateLabels()
      // 3. xref targets have been changed
      // 4. refType of an xref has been changed (TODO: do we really need this?)
      } else if (this._detectChangeRefTarget(op) || this._detectChangeRefType(op)) {
        return this._updateLabels()
      }
    }
  }

  _detectAddRemoveXref (op) {
    return (op.val && op.val.type === 'xref' && op.val.refType === this.refType)
  }

  _detectAddRemoveCitable (op, change) {
    return (op.val && this.targetTypes.has(op.val.type))
  }

  _detectChangeRefTarget (op) {
    if (op.path[1] === 'refTargets') {
      let doc = this._getDocument()
      let node = doc.get(op.path[0])
      return (node && node.refType === this.refType)
    } else {
      return false
    }
  }

  _detectChangeRefType (op) {
    return (op.path[1] === 'refType' && (op.val === this.refType || op.original === this.refType))
  }

  /*
    Label of bibliographic entries are determined
    by the order of their citations in the document.
    I.e. typically you pick all citations (`<xref>`) as they
    occur in the document, and provide the ids of the entries
    they refer to. This forms a list of tuples, such as:
    ```
      [
        { id: 'cite1', refs: [AB06, Mac10] },
        { id: 'cite2', refs: [FW15] },
        { id: 'cite3', refs: [Mac10, AB06, AB07] }
      ]
    ```

    @param {Array<Object>} a list of citation entries.
  */
  _updateLabels (silent) {
    let xrefs = this._getXrefs()
    let refs = this.getCitables()
    let refsById = refs.reduce((m, ref) => {
      m[ref.id] = ref
      return m
    }, {})

    let stateUpdates = []

    let pos = 1
    let order = {}
    let refLabels = {}
    let xrefLabels = {}
    xrefs.forEach((xref) => {
      let isInvalid = false
      let numbers = []
      let targetIds = xref.refTargets
      for (let id of targetIds) {
        // fail if there is an unknown id
        if (!refsById[id]) {
          isInvalid = true
          continue
        }
        if (!order.hasOwnProperty(id)) {
          order[id] = pos
          refLabels[id] = this.labelGenerator.getLabel(pos)
          pos++
        }
        numbers.push(order[id])
      }
      // invalid labels shall be the same as empty ones
      if (isInvalid) {
        // HACK: we just signal invalid references with a ?
        numbers.push('?')
        console.warn(`invalid label detected for ${xref.id}`)
      }
      xrefLabels[xref.id] = this.labelGenerator.getLabel(numbers)
    })

    // HACK
    // Now update the node state of all affected xref[ref-type='bibr']
    // TODO: solve this properly
    xrefs.forEach(xref => {
      const label = xrefLabels[xref.id]
      const state = { label }
      stateUpdates.push([xref.id, state])
    })
    refs.forEach((ref, index) => {
      const label = refLabels[ref.id] || ''
      const state = { label }
      if (order[ref.id]) {
        state.pos = order[ref.id]
      } else {
        state.pos = pos + index
      }
      stateUpdates.push([ref.id, state])
    })

    // FIXME: here we also made the 'collection' dirty originally

    this.documentSession.updateNodeStates(stateUpdates, silent)
  }

  _getDocument () {
    return this.documentSession.getDocument()
  }

  _getXrefs () {
    // TODO: is it really a good idea to tie this implementation to 'article' here?
    const article = this._getDocument().get('article')
    let refs = article.findAll(`xref[refType='${this.refType}']`)
    return refs
  }

  _getLabelGenerator () {
    return this.labelGenerator
  }
}
