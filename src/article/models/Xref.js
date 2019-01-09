import { STRING } from 'substance'
import { InlineNode } from '../../kit'

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
