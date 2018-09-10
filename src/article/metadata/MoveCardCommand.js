import { Command } from 'substance'

export default class MoveCardCommand extends Command {
  getCommandState (params, context) {
    return { disabled: this.isDisabled(params, context) }
  }

  execute (params, context) {
    // const direction = this.config.direction
    /* TODO: change the order */
  }

  isDisabled (params, context) {
    return params.selection.getType() !== 'property' || !this._getCollectionForNode(params, context).isMovable
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
