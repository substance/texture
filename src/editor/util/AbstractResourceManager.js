import { DocumentChange, array2table, isArrayEqual } from 'substance'
import { XREF_TARGET_TYPES } from './xrefHelpers'

/*
  A base class for FigureManager and TableManager
  where the labels depend on the order of the resources in the document.

  TODO: find a better name
*/
export default class AbstractResourceManager {

  constructor(editorSession, type, labelGenerator) {
    this.editorSession = editorSession
    if(!this.editorSession) {
      throw new Error("'editorSession' is mandatory.")
    }
    this.type = type
    this.labelGenerator = labelGenerator
    this._targetTypes = array2table(XREF_TARGET_TYPES[type])
    // TODO: should this be a parameter?
    // also, is it ok to assume that all these resources must be placed in a container?
    this._container = editorSession.getDocument().find('article > body')
    this._containerPath = this._container.getContentPath()

    editorSession.onUpdate('document', this._onDocumentChange, this)
  }

  dispose() {
    this.editorSession.off(this)
  }

  getAvailableResources() {
    return this._getResourcesFromDocument()
  }

  _onDocumentChange(change) {
    const TARGET_TYPES = this._targetTypes
    const doc = this.editorSession.getDocument()

    // update labels whenever
    // I.   a <target-type> node is inserted into the body
    const ops = change.ops
    let needsUpdate = false
    for (var i = 0; i < ops.length; i++) {
      let op = ops[i]
      switch (op.type) {
        // I. citation is created or deleted
        case 'update': {
          if (isArrayEqual(op.path, this._containerPath)) {
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
            }
            // III. references have been updated
            else if (op.path[2] === 'rid') {
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

  _getResourcesFromDocument() {
    return this._container.findAll(XREF_TARGET_TYPES[this.type].join(','))
  }

  _updateLabels() {
    const editorSession = this.editorSession
    const doc = editorSession.getDocument()

    let resources = this._getResourcesFromDocument()
    let resourcesById = {}
    let order = {}
    let pos = 1
    resources.forEach((res) => {
      resourcesById[res.id] = res
      order[res.id] = pos
      let label = this.labelGenerator.getLabel([pos])
      if (!res.state) {
        res.state = {}
      }
      res.state.label = label
      res.state.pos = pos
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

    // Now update the node state of all affected xref[ref-type='bibr']
    // TODO: we need a node state API
    // provided via editor session
    let change = new DocumentChange([], {}, {})
    change._extractInformation()
    xrefs.forEach((xref) => {
      const label = xrefLabels[xref.id]
      if (!xref.state) {
        xref.state = {}
      }
      xref.state.label = label
      change.updated[xref.id] = true
    })
    resources.forEach((res) => {
      change.updated[res.id] = true
    })
    editorSession._setDirty('document')
    editorSession._change = change
    editorSession._info = {}
    editorSession.startFlow()
  }

}
