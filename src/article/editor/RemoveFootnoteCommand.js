import RemoveItemCommand from './RemoveItemCommand'

export default class RemoveCollectionItemCommand extends RemoveItemCommand {
  _getCollectionForModel (context, model) {
    const api = context.api
    const node = model._node
    const parent = node.getParent()
    if (parent.type === 'table-figure') {
      const tableFigureModel = api.getModelById(parent.id)
      return tableFigureModel.getFootnotes()
    } else {
      return api.getModelById(parent.id)
    }
  }
}
