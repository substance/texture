import InsertNodeCommand from './InsertNodeCommand'
import { BlockQuote } from '../nodes'

export default class InsertBlockQuoteCommand extends InsertNodeCommand {
  getType () {
    return BlockQuote.type
  }
  execute (params, context) {
    context.api.insertBlockQuote()
  }
}
