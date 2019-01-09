import { DocumentNode, CHILDREN, PLAIN_TEXT } from 'substance'

export default class Footnote extends DocumentNode {
  static getTemplate () {
    return {
      type: 'footnote',
      content: [
        { type: 'paragraph' }
      ]
    }
  }
}
Footnote.schema = {
  type: 'footnote',
  label: PLAIN_TEXT,
  content: CHILDREN('paragraph')
}
