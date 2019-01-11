import { DocumentNode, CHILD, CHILDREN, STRING, TEXT } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'

export default class FigurePanel extends DocumentNode {
  getContent () {
    const doc = this.getDocument()
    return doc.get(this.content)
  }

  static getTemplate () {
    return {
      type: 'figure-panel',
      content: {
        type: 'graphic'
      },
      caption: [{
        type: 'paragraph'
      }],
      permission: {
        type: 'permission'
      }
    }
  }
}
FigurePanel.schema = {
  type: 'figure-panel',
  content: CHILD('graphic'),
  title: TEXT(...RICH_TEXT_ANNOS, 'xref'),
  label: STRING,
  caption: CHILDREN('paragraph'),
  permission: CHILD('permission'),
  metadata: CHILDREN('custom-metadata-field')
}
