import { array2table, isArrayEqual } from 'substance'
import { XREF_TARGET_TYPES } from './xrefHelpers'

/*
  A base class for FigureManager and TableManager
  where the labels depend on the order of the resources in the document.
*/
export default class AbstractResourceManager {
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

  getAvailableResources () {
    return this._getResourcesFromDocument()
  }

  // TODO: how could this be generalized, so that it is less dependent on the actual document model?
  _onDocumentChange (change) {
    const doc = this._getDocument()
    const TARGET_TYPES = this._targetTypes
    const contentPath = this._getContentPath()

    // update labels whenever
    // I.   a <target-type> node is inserted into the body
    const ops = change.ops
    let needsUpdate = false
    for (var i = 0; i < ops.length; i++) {
      let op = ops[i]
      switch (op.type) {
        // I. citation is created or deleted
        case 'update': {
          if (isArrayEqual(op.path, contentPath)) {
            let id = op.diff.val
            let node = doc.get(id) || change.deleted[id]
            if (node && TARGET_TYPES[node.type]) {
              needsUpdate = true
            }
          }
          break
        }
        case 'set': {
          if (op.path[1] === 'attributes') {
            // II. a ref-type has been updated
            if (op.path[2] === 'ref-type' && (op.val === this.type || op.original === this.type)) {
              needsUpdate = true
            // III. references have been updated
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
      // we should not do this in a flow
      // TODO: we need the ability to update the node state
      // either triggering a new flow, but also during a running flow
      setTimeout(() => {
        this._updateLabels()
      })
    }
  }

  _getDocument () {
    return this.documentSession.getDocument()
  }

  _getContentPath () {
    return this._getContainer().getContentPath()
  }

  // TODO: how could this be generalized?
  _getContainer () {
    if (!this._container) this._container = this._getDocument().get('body')
    return this._container
  }

  _getResourcesFromDocument () {
    return this._getContainer().findAll(XREF_TARGET_TYPES[this.type].join(','))
  }

  _updateLabels () {
    const doc = this._getDocument()

    let stateUpdates = []

    let resources = this._getResourcesFromDocument()
    let resourcesById = {}
    let order = {}
    let pos = 1
    resources.forEach((res) => {
      resourcesById[res.id] = res
      order[res.id] = pos
      let label = this.labelGenerator.getLabel([pos])
      stateUpdates.push([res.id, { label, pos }])
      pos++
    })

    let xrefs = doc.findAll(`xref[ref-type='${this.type}']`)
    let xrefLabels = {}
    xrefs.forEach((xref) => {
      let isInvalid = false
      let numbers = []
      let rids = xref.getAttribute('rid') || ''
      rids = rids.split(' ')
      for (let i = 0; i < rids.length; i++) {
        const id = rids[i]
        if (!id) continue
        if (!resourcesById[id]) {
          isInvalid = true
        } else {
          numbers.push(order[id])
        }
      }
      // invalid labels shall be the same as empty ones
      if (isInvalid) numbers = []
      xrefLabels[xref.id] = this.labelGenerator.getLabel(numbers)
    })
    // also update the state of the xrefs
    xrefs.forEach((xref) => {
      const label = xrefLabels[xref.id]
      stateUpdates.push([xref.id, { label }])
    })

    this.documentSession.updateNodeStates(stateUpdates)
  }
}
