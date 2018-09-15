import { array2table } from 'substance'
import { XREF_TARGET_TYPES } from './xrefHelpers'
import { getPos } from './nodeHelpers'

export default class AbstractCitationManager {
  constructor (documentSession, type, labelGenerator) {
    this.documentSession = documentSession
    this.type = type
    this.labelGenerator = labelGenerator
    this._targetTypes = array2table(XREF_TARGET_TYPES[type])

    documentSession.on('change', this._onDocumentChange, this)
  }

  dispose () {
    this.documentSession.off(this)
  }

  hasCitables () {
    // TODO: we should assimilate 'ContainerNode' and 'XMLElementNode' interface
    // I.e. an XMLElementNode could per se act as a classical container node
    // ATM only XMLContainerNode has this interface
    return this._getCollectionElement().getChildCount() > 0
  }

  getCitables () {
    // TODO: we should assimilate 'ContainerNode' and 'XMLElementNode' interface
    // I.e. an XMLElementNode could per se act as a classical container node
    // ATM only XMLContainerNode has this interface
    return this._getCollectionElement().getChildren()
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

    const doc = this._getDocument()

    // updateCitationLabels whenever
    // I.   an xref[ref-type='bibr'] is created or deleted
    // II.  the ref-type attribute of an xref is set to 'bibr' (creation)
    // II. the rid attribute of an xref with ref-type bibr is updated
    const ops = change.ops
    let needsUpdate = false
    for (var i = 0; i < ops.length; i++) {
      let op = ops[i]

      switch (op.type) {
        // I. citation is created or deleted
        case 'delete':
        case 'create': {
          if (op.val.type === 'xref' && op.val.attributes && op.val.attributes['ref-type'] === this.type) {
            needsUpdate = true
          }
          if (op.val.type === 'ref') {
            needsUpdate = true
          }
          if (op.val.type === 'fn') {
            needsUpdate = true
          }
          break
        }
        case 'set': {
          if (op.path[1] === 'attributes') {
            // II. citation has been created, i.e. ref-type has been set to 'bibr' (or vice versa)
            if (op.path[2] === 'ref-type' && (op.val === this.type || op.original === this.type)) {
              needsUpdate = true

            // III. the references of a citation have been updated
            } else if (op.path[2] === 'rid') {
              let node = doc.get(op.path[0])
              if (node && node.getAttribute('ref-type') === this.type) {
                needsUpdate = true
              }
            }
          }

          break
        }
        default:
          //
      }
      if (needsUpdate) break
    }
    if (needsUpdate) {
      this._updateLabels()
    }
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
  _updateLabels () {
    let xrefs = this._getXrefs()
    let refs = this.getCitables()
    let bibEl = this._getCollectionElement()
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
      let rids = xref.getAttribute('rid') || ''
      rids = rids.split(' ')
      for (let i = 0; i < rids.length; i++) {
        const id = rids[i]
        // skip if id empty
        if (!id) continue
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
        console.warn('invalid label detected for ', xref.toXML().getNativeElement())
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

    // HACK
    // TODO: solve this properly
    // e.g. we could implement this manager as a reducer on the application
    // state, and let the bibliography component react to updates of that
    if (bibEl) {
      // Note: mimicking a state update on the bibliography element itself
      // so that it rerenders, e.g. because the order might have changed
      stateUpdates.push([bibEl.id, {}])
    }

    this.documentSession.updateNodeStates(stateUpdates)
  }

  _getDocument () {
    return this.documentSession.getDocument()
  }

  _getXrefs () {
    const content = this._getContentElement()
    let refs = content.findAll(`xref[ref-type='${this.type}']`)
    return refs
  }

  _getContentElement () {
    // TODO: we should generalize this and/or move it into ArticelAPI
    // so that this code gets independent of the overall document layout
    const doc = this._getDocument()
    return doc.get('content')
  }

  _getCollectionElement () {
    throw new Error('This method is abstract.')
  }
}
