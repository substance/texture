import InsertNodeCommand from './InsertNodeCommand'

export default class InsertSupplementaryFileCommand extends InsertNodeCommand {
  execute (params, context) {
    const state = params.commandState
    const files = params.files
    if (state.disabled) return
    let api = context.api
    if (files.length > 0) {
      api._insertSupplementaryFile(files[0])
    }
  }
}
