import { InsertInlineNodeCommand as SubstanceInsertInlineNodeCommand } from 'substance'

/**
  Reusable command implementation for inserting inline nodes.

  @example

  Define a custom command.

  ```
  class AddXRefCommand extends InsertInlineNodeCommand {
    _createNode(tx) {
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
  getType () {
    throw new Error('This method is abstract')
  }

  /**
    Insert new inline node at the current selection
  */
  execute (params, context) {
    let state = this.getCommandState(params, context)
    if (!state.disabled) {
      this._execute(params, context)
    }
  }

  isDisabled (params) {
    const sel = params.selection
    const selectionState = params.editorSession.getSelectionState()
    // We allow inserting an inline node only if
    // 1. the selection is a property selection
    // 2. and there is no inline node already
    // Note: if a child command should only be active if collapsed, then it should
    // override isDisabled() and return super.isDisabled || sel.isCollapsed()
    return (!sel || !sel.isPropertySelection() || selectionState.isInlineNodeSelection)
  }

  /*
    Default implementation starts a transaction, and let's the command implementation create a node.
    This node gets inserted at the current cursor position and after that the inline node gets selected.
  */
  _execute (params, context) {
    // TODO: use API
    let editorSession = context.editorSession
    editorSession.transaction(tx => {
      let node = this._createNode(tx, params, context)
      tx.insertInlineNode(node)
      this._setSelection(tx, node)
    })
  }

  _setSelection (tx, inlineNode) {
    // Note: selecting the inlineNode will typically result in opening a popup for editing
    tx.selection = {
      type: 'property',
      path: inlineNode.getPath(),
      startOffset: inlineNode.start.offset,
      endOffset: inlineNode.end.offset
    }
  }

  _createNode (tx, params, context) { // eslint-disable-line no-unused-vars
    throw new Error('This method is abstract')
  }
}
