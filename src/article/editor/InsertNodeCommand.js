import { InsertNodeCommand as SubstanceInsertNodeCommand } from 'substance'

export default class InsertNodeCommand extends SubstanceInsertNodeCommand {
  execute (params, context) {
    var state = params.commandState
    if (state.disabled) return
    let editorSession = context.editorSession
    editorSession.transaction((tx) => {
      let node = this.createNode(tx, params, context)
      tx.insertBlockNode(node)
      this.setSelection(tx, node)
    })
  }

  createNode(tx) { // eslint-disable-line
    throw new Error('This method is abstract')
  }
}
