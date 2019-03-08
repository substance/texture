import { Command } from 'substance'

export default class RemoveReferenceCommand extends Command {
  getCommandState (params, context) {
    return { disabled: this.isDisabled(params, context) }
  }

  isDisabled (params, context) {
    const xpath = params.selectionState.xpath
    const isCustomSelection = params.selection.isCustomSelection()
    if (!isCustomSelection) return true
    // Every reference should be inside article references property
    return xpath[xpath.length - 1].property !== 'references'
  }

  execute (params, context) {
    const api = context.api
    const reference = params.selectionState.node
    api._removeReference(reference)
  }
}
