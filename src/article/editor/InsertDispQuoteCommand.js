import InsertNodeCommand from './InsertNodeCommand'

export default class InsertDispQuoteCommand extends InsertNodeCommand {
  createNode (tx) {
    let dispQuote = tx.createElement('disp-quote')
    dispQuote.append(
      tx.createElement('disp-quote-content').append(
        tx.createElement('p').text('')
      ),
      tx.createElement('attrib').text('')
    )
    return dispQuote
  }
}
