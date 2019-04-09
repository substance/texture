import InsertNodeCommand from './InsertNodeCommand'

// TODO: this is kind of surprising, because it actually allows to insert multiple figures at once
export default class InsertFigureCommand extends InsertNodeCommand {
  execute (params, context) {
    const state = params.commandState
    const files = params.files
    if (state.disabled) return
    let api = context.api
    if (files.length > 0) {
      api._insertFigures(files)
    }
  }
}
