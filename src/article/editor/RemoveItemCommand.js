import { Command, documentHelpers } from 'substance'
import { findParentByType } from '../shared/nodeHelpers'

// TODO: We already have collection commands for metadata,
// maybe we should use set of commands
export default class RemoveItemCommand extends Command {
  getCommandState (params, context) {
    return { disabled: this.isDisabled(params, context) }
  }

  execute (params, context) {
    const node = this._getNodeForSelection(params, context)
    const path = this._getPath(context, node)
    let editorSession = context.editorSession
    editorSession.transaction(tx => {
      documentHelpers.remove(tx, path, node.id)
      documentHelpers.deepDeleteNode(tx, node.id)
      tx.selection = null
    })
  }

  isDisabled (params, context) {
    const nodeType = this.config.nodeType
    const xpath = params.selectionState.xpath
    return !xpath.find(n => n.type === nodeType)
  }

  _getNodeForSelection (params, context) {
    const nodeType = this.config.nodeType
    const sel = params.selection
    const doc = params.editorSession.getDocument()
    const nodeId = sel.getNodeId()
    const selectedNode = doc.get(nodeId)
    return findParentByType(selectedNode, nodeType)
  }

  _getPath (context, node) {
    const parent = node.getParent()
    const propName = node.getXpath().property
    return [parent.id, propName]
  }
}
