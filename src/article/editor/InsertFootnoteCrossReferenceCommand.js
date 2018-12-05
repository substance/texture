import { findParentByType } from '../shared/nodeHelpers'
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
    const doc = params.editorSession.getDocument()
    const nodeId = params.selection.getNodeId()
    const node = doc.get(nodeId)
    const parentTable = findParentByType(node, 'table-figure')
    return parentTable ? 'table' : 'manuscript'
  }
}
