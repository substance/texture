import InsertNodeCommand from './InsertNodeCommand'

export default class InsertDispFormulaCommand extends InsertNodeCommand {
  createNode (tx) {
    return tx.create({ type: 'block-formula' })
  }
}
