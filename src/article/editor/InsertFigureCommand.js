import { InsertNodeCommand as SubstanceInsertNodeCommand } from 'substance'
import insertFigure from './insertFigure'

export default class InsertNodeCommand extends SubstanceInsertNodeCommand {
  execute (params, context) {
    let state = params.commandState
    if (state.disabled) return
    let editorSession = this._getEditorSession(params, context)
    editorSession.transaction((tx) => {
      let node = this.createNodes(tx, params, context)
      this.setSelection(tx, node)
    })
  }

  createNodes (tx, params, context) {
    let lastNode = {}
    params.files.forEach(file => {
      let node = insertFigure(tx, file, context)
      lastNode = tx.insertBlockNode(node)
    })
    return lastNode
  }
}
