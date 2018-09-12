import InsertNodeCommand from './InsertNodeCommand'

export default class InsertDispQuoteCommand extends InsertNodeCommand {
  createNode (tx, params, context) {
    return context.api._createDispQuote(tx)
  }
}
