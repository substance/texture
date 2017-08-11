import { InsertNodeCommand as SubstanceInsertNodeCommand } from 'substance'

export default class InsertNodeCommand extends SubstanceInsertNodeCommand {

  execute(params, context) {
    var state = params.commandState
    if (state.disabled) return
    let editorSession = this._getEditorSession(params, context)
    editorSession.transaction((tx) => {
      let node = this.createNode(tx, params, context)
      tx.insertBlockNode(node.id)
      this.setSelection(tx, node)
    })
  }

  createNode(tx) { // eslint-disable-line
    throw new Error('This method is abstract')
  }

}
