import { DocumentIndex, TreeIndex } from 'substance'
import { getXrefTargets } from './shared/xrefHelpers'

/*
  Index for Xrefs.

  @example
  Lets us look up existing xrefs by target

  To get all xrefs for a given target node (e.g. fn-1)

    var xIndex = doc.xrefIndex
    xIndex.get('fn-1')
*/
export default class XrefIndex extends DocumentIndex {

  constructor() {
    super()
    this.byTarget = new TreeIndex.Arrays()
  }

  select(node) {
    return node.type === 'xref'
  }

  clear() {
    this.byTarget.clear()
  }

  // TODO: use object interface? so we can combine filters (path and type)
  get(targetId) {
    let ids = this.byTarget.get(targetId)
    // We need to return a clone, as the index may change while the result is used
    return ids ? ids.slice() : []
  }

  create(xref) {
    // const path = anno.start.path
    let targets = getXrefTargets(xref)
    targets.forEach((target) => {
      this.byTarget.add(target, xref.id)
    })
  }

  _delete(xrefId, targets) {
    targets.forEach((target) => {
      this.byTarget.remove(target, xrefId)
    })
  }

  delete(xref) {
    let targets = getXrefTargets(xref)
    this._delete(xref.id, targets)
  }

  update(node, path, newValue, oldValue) {
    if (path[2] === 'rid') {
      let targets = []
      if (oldValue) {
        targets = oldValue.split(" ")
      }
      this._delete(node.id, targets)
      this.create(node)
    }
  }
}
