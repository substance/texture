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
    const inlineFormula = tx.create({
      type: 'inline-formula',
      contentType: 'math/tex',
      content: initialContent
    })
    return inlineFormula
  }
}
