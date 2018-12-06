import { documentHelpers } from 'substance'
import InsertInlineNodeCommand from './InsertInlineNodeCommand'

export default class InsertInlineFormulaCommand extends InsertInlineNodeCommand {
  getType () {
    return 'inline-formula'
  }

  _createNode (tx, params, context) {
    const sel = tx.selection
    const doc = tx.getDocument()
    // Note: the user can select text and turn it into a formula
    const initialContent = documentHelpers.getTextForSelection(doc, sel)
    const inlineFormula = tx.createElement('inline-formula')
      .attr('content-type', 'math/tex')
      .appendChild(
        tx.createElement('tex-math').text(initialContent)
      )
    return inlineFormula
  }
}
