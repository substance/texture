import InsertNodeCommand from './InsertNodeCommand'
import { BlockFormula } from '../nodes'

export default class InsertBlockFormulaCommand extends InsertNodeCommand {
  getType () {
    return BlockFormula.type
  }

  execute (params, context) {
    context.api.insertBlockFormula()
  }
}
