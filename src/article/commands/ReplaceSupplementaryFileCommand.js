import { Command } from 'substance'

export default class ReplaceSupplementaryFileCommand extends Command {
  getCommandState (params, context) {
    const xpath = params.selectionState.xpath
    if (xpath.length > 0) {
      const selectedType = xpath[xpath.length - 1].type
      if (selectedType === 'supplementary-file') {
        const node = params.selectionState.node
        if (!node.remote) {
          return { disabled: false }
        }
      }
    }
    return { disabled: true }
  }

  execute (params, context) {
    const state = params.commandState
    if (state.disabled) return
    const files = params.files
    const supplementaryFileNode = params.selectionState.node
    let api = context.api
    if (files.length > 0) {
      api._replaceSupplementaryFile(files[0], supplementaryFileNode)
    }
  }
}
