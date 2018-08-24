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

export default class InsertInlineNodeCommand extends SubstanceInsertInlineNodeCommand {
  /**
    Insert new inline node at the current selection
  */
  execute (params, context) {
    // TODO: use ArticleAPI
    let state = this.getCommandState(params, context)
    if (state.disabled) return
    let editorSession = context.editorSession
    editorSession.transaction((tx) => {
      let node = this.createNode(tx, params, context)
      tx.insertInlineNode(node)
      this.setSelection(tx, node)
    })
  }

  createNode (tx, context) { // eslint-disable-line no-unused-vars
    throw new Error('This method is abstract')
  }

  setSelection (tx, node) {
    if (node.isPropertyAnnotation()) {
      tx.selection = {
        type: 'property',
        path: node.getPath(),
        startOffset: node.startOffset,
        endOffset: node.endOffset
      }
    }
  }
}
