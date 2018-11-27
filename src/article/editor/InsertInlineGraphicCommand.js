import InsertInlineNodeCommand from './InsertInlineNodeCommand'

export default class InsertInlineGraphicCommand extends InsertInlineNodeCommand {
  getType () {
    return 'inline-graphic'
  }

  execute (params, context) {
    const state = params.commandState
    const files = params.files
    if (state.disabled) return
    let api = context.api
    if (files.length > 0) {
      api._insertInlineGraphic(files[0])
    }
  }

  isDisabled (params) {
    const sel = params.selection
    const selectionState = params.editorSession.getSelectionState()
    if (!sel.isPropertySelection()) {
      return true
    }
    // We don't allow inserting an inline node on top of an existing inline node.
    if (selectionState.isInlineNodeSelection) {
      return true
    }
    return false
  }
}
