import { Command } from 'substance'
import { findParentByType } from '../shared/nodeHelpers'

export default class RemoveItemCommand extends Command {
  getCommandState (params, context) {
    let node = this._getNode(params)
    return {
      disabled: !node,
      nodeId: node ? node.id : null
    }
  }

  _getNode (params) {
    const nodeType = this.config.nodeType
    const sel = params.selection
    if (sel && !sel.isNull()) {
      const doc = params.editorSession.getDocument()
      const nodeId = sel.getNodeId()
      if (nodeId) {
        const selectedNode = doc.get(nodeId)
        if (selectedNode.type === nodeType) return selectedNode
        return findParentByType(selectedNode, nodeType)
      }
    }
  }
}
