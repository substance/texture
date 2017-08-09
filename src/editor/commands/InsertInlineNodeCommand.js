import { Command } from 'substance'

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

class InsertInlineNodeCommand extends Command {
  /**
    @param config Takes a config object, provided on registration in configurator
  */
  constructor(...args) {
    super(...args)
  }

  getType() {
    throw new Error('Abstract method')
  }

  /**
    Determine command state for inline node insertion. Command is enabled
    if selection is a property selection.
  */
  getCommandState(params) {
    let sel = params.selection
    let newState = {
      disabled: this.isDisabled(params),
      active: false,
      showInContext: this.showInContext(sel, params)
    }
    return newState
  }

  isAnnotationCommand() {
    return true
  }
  /*
    When cursor is not collapsed tool may be displayed in context (e.g. in an
    overlay)
  */
  showInContext(sel) {
    return !sel.isCollapsed()
  }

  isDisabled(params) {
    let sel = params.selection
    let selectionState = params.editorSession.getSelectionState()
    if (!sel.isPropertySelection()) {
      return true
    }

    // We don't allow inserting an inline node on top of an existing inline
    // node.
    if (selectionState.isInlineNodeSelection()) {
      return true
    }
    return false
  }

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
