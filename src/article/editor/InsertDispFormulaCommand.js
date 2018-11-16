import InsertNodeCommand from './InsertNodeCommand'

export default class InsertDispFormulaCommand extends InsertNodeCommand {
  createNode (tx, params, context) {
    return context.api._createDispFormula(tx)
  }
}
