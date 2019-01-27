import { Command } from 'substance'

/*
  We are using this command only for state computation.
  Actual implementation of file downloading is done inside DownloadSupplementaryFileTool
*/
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
  }
}
