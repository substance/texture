import { documentHelpers } from 'substance'
import { BlockQuote } from '../nodes'
import InsertNodeCommand from './InsertNodeCommand'

export default class InsertBlockQuoteCommand extends InsertNodeCommand {
  createNode (tx, params, context) {
    return documentHelpers.createNodeFromJson(tx, BlockQuote.getTemplate())
  }
}
