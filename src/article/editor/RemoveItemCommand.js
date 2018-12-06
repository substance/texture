import { Command } from 'substance'
import { findParentByType } from '../shared/nodeHelpers'

// TODO: We already have collection commands for metadata,
// maybe we should use set of commands
export default class RemoveItemCommand extends Command {
  getCommandState (params, context) {
    return { disabled: this.isDisabled(params, context) }
  }

  execute (params, context) {
    const model = this._getModelForSelection(params, context)
    const collection = this._getCollectionForModel(context, model)
    collection.removeItem(model)
  }

  isDisabled (params, context) {
    const nodeType = this.config.nodeType
    const xpath = params.selectionState.xpath
    return xpath.indexOf(nodeType) === -1
  }

  _getModelForSelection (params, context) {
    const nodeType = this.config.nodeType
    const api = context.api
    const sel = params.selection
    const doc = params.editorSession.getDocument()
    const nodeId = sel.getNodeId()
    const selectedNode = doc.get(nodeId)
    const node = findParentByType(selectedNode, nodeType)
    return api.getModelById(node.id)
  }

  _getCollectionForModel (context, model) {
    const api = context.api
    const node = model._node
    const parent = node.getParent()
    return api.getModelById(parent.id)
  }
}
