import { Command } from 'substance'

export default class DownloadSupplementaryFileCommand extends Command {
  getCommandState (params, context) {
    const xpath = params.selectionState.xpath
    if (xpath.length > 0) {
      const selectedType = xpath[xpath.length - 1].type
      return { disabled: selectedType !== 'supplementary-file' }
    }
    return { disabled: true }
  }

  execute (params, context) {
    const state = params.commandState
    if (state.disabled) return
    const node = params.selectionState.node
    const remote = node.remote
    if (remote) {
      // download node.href
    } else {
      const fileId = node.href.split('.')[0]
      if (fileId) {
        // const blob = context.archive.buffer.getBlob(fileId)
        // download file
      }
    }
  }
}
