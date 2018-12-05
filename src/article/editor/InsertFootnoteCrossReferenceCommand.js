import { hasAvailableXrefTargets } from '../shared/xrefHelpers'
import InsertXrefCommand from './InsertXrefCommand'

export default class InsertFootnoteCrossReferenceCommand extends InsertXrefCommand {
  getCommandState (params, context) {
    let sel = params.selection
    let newState = {
      disabled: this.isDisabled(params, context),
      active: false,
      showInContext: this.showInContext(sel, params, context),
      scope: this.detectScope(params, context)
    }
    return newState
  }

  detectScope (params, context) {
    const xpath = params.selectionState.xpath
    return xpath.indexOf('table-figure') > -1 ? 'table-figure' : false
  }

  isDisabled (params, context) {
    const sel = params.selection
    const refType = this.config.refType
    const scope = this.config.scope
    const currentScope = this.detectScope(params)
    let hasTargets = false
    if (!currentScope) {
      hasTargets = hasAvailableXrefTargets(refType, context) && !scope
    } else {
      const doc = params.editorSession.getDocument()
      const nodeId = params.selection.getNodeId()
      const node = doc.get(nodeId)
      hasTargets = hasAvailableXrefTargets(refType, context, node) && scope === currentScope
    }

    // don't xref insertion
    // 1. if the selections is not a collapsed property selection
    // 2. if there are no citable targets available
    if (!sel.isPropertySelection() || !sel.isCollapsed() || !hasTargets) {
      return true
    }
    return false
  }
}
