import InsertInlineNodeCommand from './InsertInlineNodeCommand'

export default class InsertInlineFormulaCommand extends InsertInlineNodeCommand {
  getType() {
    return 'inline-formula'
  }

  createNode(tx) {
    const math = tx.createElement('tex-math').text('f(x)')
    const inlineFormula = tx.createElement('inline-formula')
      .attr('content-type', 'math/tex')

    //inlineFormula._childNodes.push(math.id)
    return inlineFormula
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
