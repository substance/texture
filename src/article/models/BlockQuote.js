import { DocumentNode, CONTAINER } from 'substance'

export default class BlockQuote extends DocumentNode {
  // used to create an empty node
  static getTemplate () {
    return {
      type: 'block-quote',
      content: [
        { type: 'paragraph' }
      ]
    }
  }
}
BlockQuote.schema = {
  type: 'block-quote',
  content: CONTAINER('paragraph'),
  attrib: 'text'
}
