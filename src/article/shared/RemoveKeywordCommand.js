import { Command, documentHelpers } from 'substance'

export default class RemoveKeywordCommand extends Command {
  getCommandState (params, context) {
    return { disabled: false }
  }

  execute (params, context) {
    const { path, idx } = params
    const editorSession = context.editorSession
    editorSession.transaction(tx => {
      documentHelpers.removeAt(tx, path, idx)
    })
  }
}
