import { Command } from 'substance'

export default class ReplaceSupplementaryFileCommand extends Command {
  getCommandState (params, context) {
    const xpath = params.selectionState.xpath
    if (xpath.length > 0) {
      const selectedType = xpath[xpath.length - 1].type
      return {
        disabled: selectedType !== 'supplementary-file'
      }
    } else {
      return { disabled: true }
    }
  }

  execute (params, context) {
    const state = params.commandState
    const files = params.files
    const doc = params.editorSession.getDocument()
    const supplementaryFileNodeId = params.selection.nodeId
    const supplementaryFileNode = doc.get(supplementaryFileNodeId)
    if (state.disabled) return
    let api = context.api
    if (files.length > 0) {
      api._replaceSupplementaryFile(files[0], supplementaryFileNode)
    }
  }
}
