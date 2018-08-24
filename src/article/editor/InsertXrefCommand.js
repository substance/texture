import { hasAvailableXrefTargets } from '../shared/xrefHelpers'
import InsertInlineNodeCommand from './InsertInlineNodeCommand'

export default class InsertXrefCommand extends InsertInlineNodeCommand {
  getType () {
    return 'xref'
  }

  createNode (tx) {
    const refType = this.config.refType
    let xref = tx.createElement('xref')
    xref.attr('ref-type', refType)
    xref.attr('rid', '')
    return xref
  }

  isDisabled (params, context) {
    const sel = params.selection
    const refType = this.config.refType
    const hasTargets = hasAvailableXrefTargets(refType, context)
    // don't xref insertion
    // 1. if the selections is not a collapsed property selection
    // 2. if there are no citable targets available
    if (!sel.isPropertySelection() || !sel.isCollapsed() || !hasTargets) {
      return true
    }
    return false
  }
}
