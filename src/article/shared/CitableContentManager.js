import { isArrayEqual } from 'substance'
import { XREF_TARGET_TYPES } from './xrefHelpers'
import AbstractCitationManager from './AbstractCitationManager'

/*
  A base class for FigureManager and TableManager. In contrast to citables like references or footnotes,
  the citable content is part of the content itself, and has a fixed order defined by the occurrence in the document.
  E.g. a reference is sorted and labeled according to the order of citations, but a figure is labeled according
  to the occurence in the content.
*/
export default class CitableContentManager extends AbstractCitationManager {
  hasCitables () {
    return Boolean(this._getContentElement().find(XREF_TARGET_TYPES[this.type].join(',')))
  }

  getCitables () {
    return this._getContentElement().findAll(XREF_TARGET_TYPES[this.type].join(','))
  }

  getSortedCitables () {
    return this.getCitables()
  }

  /*
    Detection of changes that have an impact on the labeling is different to references.
    Labels change if
    1. Citable content is inserted or removed
    2. an xref ref-type is changed (TODO: this does not affect the other labels)
    3. xref targets are updated
  */
  _onDocumentChange (change) {
    // HACK: do not react on node state updates
    if (change.info.action === 'node-state-update') return
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
        // I. citable content is inserted or removed
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
            // III. cited targets have been updated
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

  _getContentPath () {
    return this._getContentElement().getContentPath()
  }

  _getContentElement () {
    return this._getDocument().get('body')
  }

  _updateLabels () {
    const doc = this._getDocument()

    let stateUpdates = []

    let resources = this.getCitables()
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
