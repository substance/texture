import { Command } from 'substance'

class BasicCollectionCommand extends Command {
  getCommandState (params, context) {
    return { disabled: this.isDisabled(params, context) }
  }

  isDisabled (params, context) {
    const sel = params.selection
    return sel && sel.isCustomSelection() && sel.getCustomType() !== 'model'
  }

  _getModelForSelection (params, context) {
    const sel = params.selection
    const api = context.api
    const modelId = sel.data.modelId
    return api.getModelById(modelId)
  }

  _getCollectionForModel (context, model) {
    const api = context.api
    const node = model._node
    const parent = node.getParent()
    return api.getModelById(parent.id)
  }
}

export class RemoveCollectionItemCommand extends BasicCollectionCommand {
  execute (params, context) {
    const model = this._getModelForSelection(params, context)
    const collection = this._getCollectionForModel(context, model)
    collection.removeItem(model)
  }

  isDisabled (params, context) {
    const sel = params.selection
    if (!sel || !sel.isCustomSelection() || sel.getCustomType() !== 'model') return true
    const model = this._getModelForSelection(params, context)
    const collection = this._getCollectionForModel(context, model)
    if (!collection || !collection.isRemovable) return true
    return false
  }
}

export class MoveCollectionItemCommand extends BasicCollectionCommand {
  execute (params, context) {
    const direction = this.config.direction
    const model = this._getModelForSelection(params, context)
    const collection = this._getCollectionForModel(context, model)
    if (direction === 'up') {
      collection.moveUp(model)
    } else if (direction === 'down') {
      collection.moveDown(model)
    }
  }

  isDisabled (params, context) {
    const sel = params.selection
    if (!sel || !sel.isCustomSelection() || sel.getCustomType() !== 'model') return true
    const model = this._getModelForSelection(params, context)
    const collection = this._getCollectionForModel(context, model)
    if (!collection || !collection.isMovable) return true
    const direction = this.config.direction
    const pos = collection._getModelPosition(model)
    if (direction === 'up' && pos === 0) return true
    if (direction === 'down' && pos === collection.length - 1) return true
    return false
  }
}
