import { isArrayEqual, map } from 'substance'
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
    return Boolean(this._getContentElement().find(this._getItemSelector()))
  }

  getCitables () {
    return this._getContentElement().findAll(this._getItemSelector())
  }

  getSortedCitables () {
    return this.getCitables()
  }

  _getItemSelector () {
    return XREF_TARGET_TYPES[this.refType].join(',')
  }

  _getXrefs () {
    return this._getDocument().findAll(`xref[refType='${this.refType}']`)
  }

  _detectAddRemoveCitable (op, change) {
    if (op.isUpdate()) {
      const contentPath = this._getContentPath()
      if (isArrayEqual(op.path, contentPath)) {
        const doc = this._getDocument()
        let id = op.diff.val
        let node = doc.get(id) || change.deleted[id]
        return (node && this.targetTypes.has(node.type))
      }
    }
    return false
  }

  _getContentPath () {
    return this._getContentElement().getContentPath()
  }

  _getContentElement () {
    return this._getDocument().get('body')
  }

  _updateLabels (silent) {
    let targetUpdates = this._computeTargetUpdates()
    let xrefUpdates = this._computeXrefUpdates(targetUpdates)
    let stateUpdates = map(targetUpdates, this._stateUpdate).concat(map(xrefUpdates, this._stateUpdate))
    // HACK: do not propagate change initially
    this.documentSession.updateNodeStates(stateUpdates, silent)
  }

  _stateUpdate (record) {
    return [record.id, {label: record.label}]
  }

  _computeTargetUpdates () {
    let resources = this.getCitables()
    let pos = 1
    let targetUpdates = {}
    for (let res of resources) {
      let id = res.id
      let label = this.labelGenerator.getLabel([pos])
      // Note: pos is needed to create order specific labels
      targetUpdates[id] = { id, label, pos }
      pos++
    }
    return targetUpdates
  }

  _computeXrefUpdates (targetUpdates) {
    const targetIds = new Set(Object.keys(targetUpdates))
    let xrefs = this._getXrefs()
    let xrefUpdates = {}
    for (let xref of xrefs) {
      // ATTENTION: this might not always be numbers, but could also be something like this: [{pos: 1}, {pos: 2}]
      // if citables are nested
      // TODO: find a better name
      let numbers = []
      // NOTE: if there are rids that can not be resolved as a valid target these will be ignored
      // TODO: in future there should be a IssueManager checking for the validity of these refs
      for (let targetId of xref.refTargets) {
        if (targetIds.has(targetId)) {
          numbers.push(targetUpdates[targetId].pos)
        }
      }
      // invalid labels shall be the same as empty ones
      let id = xref.id
      let label = this.labelGenerator.getCombinedLabel(numbers)
      xrefUpdates[id] = { id, label }
    }
    return xrefUpdates
  }
}
