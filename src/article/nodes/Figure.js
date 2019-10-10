import { DocumentNode, STRING, TEXT, CHILD, CONTAINER } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'
import Xref from './Xref'
import Graphic from './Graphic'
import Paragraph from './Paragraph'
import Permission from './Permission'

export default class Figure extends DocumentNode {
  static get refType () {
    return 'fig'
  }

  static getTemplate () {
    return {
      type: 'figure',
      content: {
        type: 'graphic'
      },
      legend: [{
        type: 'paragraph'
      }],
      permission: {
        type: 'permission'
      }
    }
  }
}

Figure.schema = {
  type: 'figure',
  label: STRING,
  title: TEXT(...RICH_TEXT_ANNOS, Xref.type),
  content: CHILD(Graphic.type),
  legend: CONTAINER({
    nodeTypes: [Paragraph.type],
    defaultTextType: Paragraph.type
  }),
  permission: CHILD(Permission.type)
}
