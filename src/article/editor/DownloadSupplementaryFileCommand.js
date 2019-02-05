import { Command } from 'substance'

/*
  We are using this command only for state computation.
  Actual implementation of file downloading is done inside DownloadSupplementaryFileTool
*/
export default class DownloadSupplementaryFileCommand extends Command {
  getCommandState (params, context) {
    const selectionState = params.selectionState
    const xpath = selectionState.xpath
    if (xpath.length > 0) {
      const selectedType = xpath[xpath.length - 1].type
      if (selectedType === 'supplementary-file') {
        return {
          disabled: false,
          // leaving the node, so that the tool can apply different
          // strategies for local vs remote files
          node: selectionState.node
        }
      }
    }
    return { disabled: true }
  }

  execute (params, context) {
    // Nothing: downloading is implemented via native download hooks
  }
}
