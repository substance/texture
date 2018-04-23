import { InsertInlineNodeCommand as SubstanceInsertInlineNodeCommand } from 'substance'

export default class InsertInlineFormulaCommand extends SubstanceInsertInlineNodeCommand {
  getType() {
    return 'inline-formula'
  }

  createNode(tx) {
    const inlineFormula = tx.createElement('inline-formula')
      .attr('content-type', 'math/tex')
      .appendChild(
        tx.createElement('tex-math').text('f(x)')
      )

    return inlineFormula
  }

  /**
    Insert new inline node at the current selection
  */
  execute(params) {
    let state = this.getCommandState(params)
    if (state.disabled) return
    let editorSession = this._getEditorSession(params)
    editorSession.transaction((tx) => {
      const node = tx.createElement('inline-formula')
        .attr('content-type', 'math/tex')
      const inlineFormula = tx.insertInlineNode(node)
      inlineFormula.appendChild(
        tx.createElement('tex-math').text('f(x)')
      )
      this.setSelection(tx, node)
    })
  }

  setSelection(tx, node) {
    if(node.isPropertyAnnotation()) {
      tx.selection = {
        type: 'property',
        path: node.getPath(),
        startOffset: node.startOffset,
        endOffset: node.endOffset
      }
    }
  }

  isDisabled(params) {
    const sel = params.selection
    const selectionState = params.editorSession.getSelectionState()
    const editor = params.editorSession.getEditor()
    if (!editor) return true

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
}
