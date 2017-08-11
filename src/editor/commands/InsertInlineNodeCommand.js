import { InsertInlineNodeCommand as SubstanceInsertInlineNodeCommand } from 'substance'

/**
  Reusable command implementation for inserting inline nodes.

  @class InsertInlineNodeCommand

  @example

  Define a custom command.

  ```
  class AddXRefCommand extends InsertInlineNodeCommand {
    createNode(tx) {
      let refType = this.config.refType
      let xref = tx.createElement('xref').attr('publication-type', 'journal')
      xref.attr('ref-type', refType)
      xref.attr('rid', '')
      return xref
    }
  }
  ```

  Register it in your app using the configurator.

  ```
  config.addCommand('add-xref', AddXRefCommand, { nodeType: 'xref' })
  ```
*/

class InsertInlineNodeCommand extends SubstanceInsertInlineNodeCommand {

  /**
    Insert new inline node at the current selection
  */
  execute(params) {
    let state = this.getCommandState(params)
    if (state.disabled) return
    let editorSession = this._getEditorSession(params)
    editorSession.transaction((tx) => {
      let node = this.createNode(tx, params)
      tx.insertInlineNode(node.id)
    })
  }

  createNode(tx) { // eslint-disable-line
    throw new Error('This method is abstract')
  }

}

export default InsertInlineNodeCommand
