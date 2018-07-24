import { InsertInlineNodeCommand as SubstanceInsertInlineNodeCommand, documentHelpers } from 'substance'

export default class InsertInlineFormulaCommand extends SubstanceInsertInlineNodeCommand {
  getType() {
    return 'inline-formula'
  }

  createNode(tx) {
    const inlineFormula = tx.createElement('inline-formula')
      .attr('content-type', 'math/tex')
      .appendChild(
        tx.createElement('tex-math')
      )
    return inlineFormula
  }

  /**
    Insert new inline node at the current selection
  */
  execute(params) {
    const state = this.getCommandState(params)
    if (state.disabled) return
    const editorSession = this._getEditorSession(params)
    const sel = params.selection
    editorSession.transaction((tx) => {
      const doc = tx.getDocument()
      const text = documentHelpers.getTextForSelection(doc, sel)
      const node = tx.createElement('inline-formula')
        .attr('content-type', 'math/tex')
      const inlineFormula = tx.insertInlineNode(node)
      inlineFormula.appendChild(
        tx.createElement('tex-math').text(text)
      )
      this.setSelection(tx, node)
    })
  }

  setSelection(tx, node) {
    if(node.isPropertyAnnotation()) {
      tx.selection = {
        type: 'property',
        path: node.getPath(),
        startOffset: node.start.offset,
        endOffset: node.end.offset
      }
    }
  }

  isDisabled(params) {
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
