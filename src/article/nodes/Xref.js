import { STRING, InlineNode } from 'substance'

export default class Xref extends InlineNode {}
Xref.schema = {
  type: 'xref',
  label: STRING,
  refType: STRING,
  refTargets: {
    type: ['array', 'id'],
    default: []
  }
}
