import { Command } from 'substance'

class BasicCollectionCommand extends Command {
  getCommandState (params, context) {
    return { disabled: this.isDisabled(params, context) }
  }

  isDisabled (params, context) {
    return params.selection.getType() !== 'property'
  }

  _getCardModel (params, context) {
    const nodeId = params.selection.getNodeId()
    const doc = context.editorSession.getDocument()
    const node = doc.get(nodeId)
    return this._getCardModelForNode(node, context)
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

export class RemoveCollectionItemCommand extends BasicCollectionCommand {
  execute (params, context) {
    const model = this._getCardModel(params, context)
    const collection = this._getCollectionForNode(params, context)
    collection.removeItem(model)
  }

  isDisabled (params, context) {
    return params.selection.getType() !== 'property' || !this._getCollectionForNode(params, context).isRemovable
  }
}

export class MoveCollectionItemCommand extends BasicCollectionCommand {
  execute (params, context) {
    const direction = this.config.direction
    const model = this._getCardModel(params, context)
    const collection = this._getCollectionForNode(params, context)
    if (direction === 'up') {
      collection.moveUp(model)
    } else if (direction === 'down') {
      collection.moveDown(model)
    }
  }

  isDisabled (params, context) {
    if (params.selection.getType() !== 'property') return true
    const collection = this._getCollectionForNode(params, context)
    if (!collection.isMovable) return true
    const direction = this.config.direction
    const model = this._getCardModel(params, context)
    const pos = collection._getModelPosition(model)
    if (direction === 'up' && pos === 0) return true
    if (direction === 'down' && pos === collection.length - 1) return true
    return false
  }
}
