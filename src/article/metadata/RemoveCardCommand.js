import { Command } from 'substance'

export default class RemoveCardCommand extends Command {
  getCommandState (params, context) {
    return { disabled: this.isDisabled(params, context) }
  }

  execute (params, context) {
    const nodeId = params.selection.getNodeId()
    const doc = context.editorSession.getDocument()
    const node = doc.get(nodeId)
    const model = this._getCardModelForNode(node, context)
    const collection = this._getCollectionForNode(params, context)
    collection.removeItem(model)
  }

  isDisabled (params, context) {
    return params.selection.getType() !== 'property' || !this._getCollectionForNode(params, context).isRemovable
  }

  _getCollectionForNode (params, context) {
    const nodeId = params.selection.getNodeId()
    const doc = params.editorSession.getDocument()
    const node = doc.get(nodeId)
    const collection = this._getParentCollection(node, context)
    return collection
  }

  _getCardModelForNode (node, context) {
    let parent = node.getParent()
    let collection = context.api.getModel(parent.type)
    let model
    if (!collection) {
      // NOTE: we are bubling up until we reach
      // a child model of registered collection
      model = this._getCardModelForNode(parent, context)
    } else {
      model = context.api.getModelById(node.id)
    }
    return model
  }

  _getParentCollection (node, context) {
    const parent = node.getParent()
    let collection = context.api.getModel(parent.type)
    if (!collection) {
      // NOTE: we are bubling up until we found a registered collection
      collection = this._getParentCollection(parent, context)
    }
    return collection
  }
}
