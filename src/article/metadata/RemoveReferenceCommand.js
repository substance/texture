import RemoveItemCommand from '../shared/RemoveItemCommand'

export default class RemoveReferenceCommand extends RemoveItemCommand {
  isDisabled (params, context) {
    const node = this._getNode(params)
    const isCustomSelection = params.selection.isCustomSelection()
    if (!isCustomSelection || !node) return true
    // Every reference should be inside article references property
    return node.getXpath().property !== 'references'
  }

  _getNode (params) {
    return params.selectionState.node
  }
}
