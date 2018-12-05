import { findParentByType } from '../shared/nodeHelpers'
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

  detectScope (params) {
    const parentTable = this._getParentTable(params)
    return parentTable ? 'table' : 'manuscript'
  }

  isDisabled (params, context) {
    const sel = params.selection
    const refType = this.config.refType
    const parentTable = this._getParentTable(params)
    let hasTargets = false
    if (parentTable) {
      const footnoteManager = parentTable._tableFootnoteManager
      hasTargets = footnoteManager.hasCitables()
    } else {
      hasTargets = hasAvailableXrefTargets(refType, context)
    }

    // don't xref insertion
    // 1. if the selections is not a collapsed property selection
    // 2. if there are no citable targets available
    if (!sel.isPropertySelection() || !sel.isCollapsed() || !hasTargets) {
      return true
    }
    return false
  }

  _getParentTable (params) {
    const doc = params.editorSession.getDocument()
    const nodeId = params.selection.getNodeId()
    const node = doc.get(nodeId)
    const parentTable = findParentByType(node, 'table-figure')
    return parentTable
  }
}
