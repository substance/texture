import { Command, documentHelpers } from 'substance'
import { findParentByType } from './nodeHelpers'

export default class RemoveItemCommand extends Command {
  getCommandState (params, context) {
    return { disabled: this.isDisabled(params, context) }
  }

  isDisabled (params, context) {
    const nodeType = this.config.nodeType
    const xpath = params.selectionState.xpath
    return !xpath.find(n => n.type === nodeType)
  }

  execute (params, context) {
    const api = context.api
    const node = this._getNode(params)
    const path = this._getPath(context, node)
    const editorSession = context.editorSession
    editorSession.transaction(tx => {
      documentHelpers.remove(tx, path, node.id)
      api._removeCorrespondingXrefs(tx, node)
      documentHelpers.deepDeleteNode(tx, node.id)
      tx.selection = null
    })
  }

  _getNode (params) {
    const nodeType = this.config.nodeType
    const sel = params.selection
    const doc = params.editorSession.getDocument()
    const nodeId = sel.getNodeId()
    const selectedNode = doc.get(nodeId)
    if (selectedNode.type === nodeType) return selectedNode
    return findParentByType(selectedNode, nodeType)
  }

  _getPath (context, node) {
    const parent = node.getParent()
    const propName = node.getXpath().property
    return [parent.id, propName]
  }
}
