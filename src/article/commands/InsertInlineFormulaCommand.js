import InsertInlineNodeCommand from './InsertInlineNodeCommand'

export default class InsertInlineFormulaCommand extends InsertInlineNodeCommand {
  getType () {
    return 'inline-formula'
  }

  execute (params, context) {
    let selectionState = context.appState.get('selectionState')
    context.api.insertInlineFormula(selectionState.selectedText)
  }
}
